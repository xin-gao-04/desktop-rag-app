const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('path')
const fs = require('fs')
const { loadConfig, saveConfig, addSource, removeSource, autoFixModelNames } = require('./lib/config-manager.cjs')
const { runDoctor, runIndex, runAsk, runAskStream } = require('./lib/rag-runner.cjs')
const { getRuntimeStatus, setupRuntime } = require('./lib/runtime-bootstrap.cjs')
const {
  importMarkdownFilesToManagedDir,
  collectMarkdownFiles,
  toSafeKbName,
  listKnowledgeBases,
  ensureKnowledgeBase,
  renameKnowledgeBase,
  deleteKnowledgeBase,
  markKnowledgeBaseIndexed,
  markKnowledgeBaseUsed,
  importMarkdownFilesToKnowledgeBase,
  importMarkdownDirectoryToKnowledgeBase
} = require('./lib/knowledge-manager.cjs')

let win
let manualWin
const askStreams = new Map()

function getRuntimeOptions() {
  const bundled = path.join(process.resourcesPath || '', 'rag-core')
  const sibling = path.resolve(__dirname, '..', '..', 'rag-core')
  const cwd = path.resolve(process.cwd(), 'rag-core')
  let mdragWorkdir = sibling
  if (fs.existsSync(bundled)) mdragWorkdir = bundled
  else if (fs.existsSync(sibling)) mdragWorkdir = sibling
  else if (fs.existsSync(cwd)) mdragWorkdir = cwd
  return {
    mdragWorkdir,
    dataRoot: app.getPath('userData')
  }
}

function createWindow() {
  win = new BrowserWindow({
    title: '本地知识库助手',
    width: 1220,
    height: 860,
    icon: path.join(__dirname, 'assets', 'app-icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  const devUrl = process.env.VITE_DEV_SERVER_URL
  if (devUrl) {
    win.loadURL(devUrl)
    if (process.env.ELECTRON_OPEN_DEVTOOLS === '1') {
      win.webContents.openDevTools({ mode: 'detach' })
    }
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  win.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    const src = sourceId ? `${sourceId}:${line}` : `line:${line}`
    console.log(`[renderer:${level}] ${message} (${src})`)
  })
  win.webContents.on('did-fail-load', (_event, code, desc, validatedURL) => {
    console.error(`[renderer] load failed code=${code} url=${validatedURL} desc=${desc}`)
  })
}

function getConfigPath() {
  return path.join(app.getPath('userData'), 'config.json')
}

function openManualWindow() {
  if (manualWin && !manualWin.isDestroyed()) {
    manualWin.focus()
    return
  }
  manualWin = new BrowserWindow({
    width: 920,
    height: 760,
    title: '操作手册',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  manualWin.loadFile(path.join(__dirname, '..', 'manual.html'))
  manualWin.on('closed', () => {
    manualWin = null
  })
}

ipcMain.handle('app:getConfig', async () => {
  const cfgPath = getConfigPath()
  let cfg = loadConfig(cfgPath, getRuntimeOptions())
  // Auto-correct model names that aren't installed in the local Ollama instance
  cfg = await autoFixModelNames(cfgPath, cfg, getRuntimeOptions())
  const hasSelectedKb = typeof cfg.selectedKnowledgeBase === 'string' && cfg.selectedKnowledgeBase.trim().length > 0
  if (hasSelectedKb) {
    const ensured = ensureKnowledgeBase(cfg.workspaceRoot, cfg.selectedKnowledgeBase)
    if (!Array.isArray(cfg.knowledgeSources) || !cfg.knowledgeSources.length) {
      cfg.knowledgeSources = [ensured.path]
    }
    cfg.selectedKnowledgeBase = ensured.name
    cfg.selectedKnowledgeBaseId = ensured.id || cfg.selectedKnowledgeBaseId || ''
  } else if (!Array.isArray(cfg.knowledgeSources)) {
    cfg.knowledgeSources = []
  }
  return cfg
})

ipcMain.handle('app:saveConfig', async (_e, cfg) => {
  return saveConfig(getConfigPath(), cfg, getRuntimeOptions())
})
ipcMain.handle('app:openManual', async () => {
  openManualWindow()
  return { ok: true }
})
ipcMain.handle('env:getRuntimeStatus', async () => {
  return getRuntimeStatus()
})
ipcMain.handle('env:setupRuntime', async (_e, options) => {
  return setupRuntime(options || {})
})

ipcMain.handle('data:addSource', async (_e, sourcePath) => {
  if (!sourcePath || typeof sourcePath !== 'string') {
    return { ok: false, error: '目录路径不能为空' }
  }
  if (!fs.existsSync(sourcePath)) {
    return { ok: false, error: `目录不存在: ${sourcePath}` }
  }
  const md = collectMarkdownFiles(sourcePath)
  if (!md.length) {
    return { ok: false, error: '该路径下未发现 Markdown 文件（.md）' }
  }
  return addSource(getConfigPath(), sourcePath, getRuntimeOptions())
})

ipcMain.handle('data:removeSource', async (_e, sourcePath) => {
  return removeSource(getConfigPath(), sourcePath, getRuntimeOptions())
})

ipcMain.handle('data:pickSourceDirectory', async () => {
  const r = await dialog.showOpenDialog(win, {
    title: '选择知识目录',
    properties: ['openDirectory']
  })
  if (r.canceled || !r.filePaths.length) return { ok: false, canceled: true }
  return { ok: true, path: r.filePaths[0] }
})

ipcMain.handle('data:pickMarkdownFiles', async () => {
  const r = await dialog.showOpenDialog(win, {
    title: '选择 Markdown 文件',
    filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
    properties: ['openFile', 'multiSelections']
  })
  if (r.canceled || !r.filePaths.length) return { ok: false, canceled: true }
  return { ok: true, files: r.filePaths }
})

ipcMain.handle('data:importMarkdownFiles', async (_e, files) => {
  const cfgPath = getConfigPath()
  const cfg = loadConfig(cfgPath, getRuntimeOptions())
  const managedDir = path.join(cfg.mdragWorkdir, '.managed_kb')
  if (!fs.existsSync(cfg.mdragWorkdir)) {
    return { ok: false, error: `RAG 工作目录不存在: ${cfg.mdragWorkdir}` }
  }
  const imported = importMarkdownFilesToManagedDir(files || [], managedDir)
  if (imported.copied > 0) {
    addSource(cfgPath, managedDir)
  }
  const latest = loadConfig(cfgPath, getRuntimeOptions())
  return { ok: true, imported: imported.copied, managedDir, config: latest }
})

ipcMain.handle('data:listKnowledgeBases', async () => {
  const cfg = loadConfig(getConfigPath(), getRuntimeOptions())
  const records = listKnowledgeBases(cfg.workspaceRoot)
  return {
    ok: true,
    workspaceRoot: cfg.workspaceRoot,
    selectedKnowledgeBase: cfg.selectedKnowledgeBase || '',
    selectedKnowledgeBaseId: cfg.selectedKnowledgeBaseId || '',
    list: records.map((x) => x.name),
    records
  }
})

ipcMain.handle('data:pickWorkspaceRoot', async () => {
  const r = await dialog.showOpenDialog(win, {
    title: '选择知识库工作空间目录',
    properties: ['openDirectory']
  })
  if (r.canceled || !r.filePaths.length) return { ok: false, canceled: true }
  return { ok: true, path: r.filePaths[0] }
})

ipcMain.handle('data:createKnowledgeBase', async (_e, kbName) => {
  const cfgPath = getConfigPath()
  const cfg = loadConfig(cfgPath, getRuntimeOptions())
  const created = ensureKnowledgeBase(cfg.workspaceRoot, kbName)
  const records = listKnowledgeBases(cfg.workspaceRoot)
  return { ok: true, created, list: records.map((x) => x.name), records }
})

ipcMain.handle('data:selectKnowledgeBase', async (_e, kbName) => {
  const cfgPath = getConfigPath()
  const cfg = loadConfig(cfgPath, getRuntimeOptions())
  const safeName = toSafeKbName(kbName)
  if (!safeName) return { ok: false, error: '知识库名称不能为空' }
  const kbDir = path.join(cfg.workspaceRoot, safeName)
  if (!fs.existsSync(kbDir)) return { ok: false, error: `知识库不存在: ${safeName}` }
  const records = listKnowledgeBases(cfg.workspaceRoot)
  const hit = records.find((x) => x.name === safeName)
  cfg.selectedKnowledgeBase = safeName
  cfg.selectedKnowledgeBaseId = hit?.id || ''
  cfg.knowledgeSources = [kbDir]
  const saved = saveConfig(cfgPath, cfg, getRuntimeOptions())
  markKnowledgeBaseUsed(cfg.workspaceRoot, safeName)
  return { ok: true, config: saved.config, selectedKnowledgeBase: safeName }
})

ipcMain.handle('data:unloadKnowledgeBase', async () => {
  const cfgPath = getConfigPath()
  const cfg = loadConfig(cfgPath, getRuntimeOptions())
  cfg.selectedKnowledgeBase = ''
  cfg.selectedKnowledgeBaseId = ''
  cfg.knowledgeSources = []
  const saved = saveConfig(cfgPath, cfg, getRuntimeOptions())
  return { ok: true, config: saved.config }
})

ipcMain.handle('data:deleteKnowledgeBase', async (_e, kbName) => {
  const cfgPath = getConfigPath()
  const cfg = loadConfig(cfgPath, getRuntimeOptions())
  const safeName = toSafeKbName(kbName)
  if (!safeName) return { ok: false, error: '知识库名称不能为空' }
  const deleted = deleteKnowledgeBase(cfg.workspaceRoot, safeName)
  if (!deleted.ok) return { ok: false, error: `知识库不存在: ${safeName}` }
  if ((cfg.selectedKnowledgeBase || '') === safeName) {
    cfg.selectedKnowledgeBase = ''
    cfg.selectedKnowledgeBaseId = ''
    cfg.knowledgeSources = []
    saveConfig(cfgPath, cfg, getRuntimeOptions())
  }
  const records = listKnowledgeBases(cfg.workspaceRoot)
  return { ok: true, list: records.map((x) => x.name), records }
})

ipcMain.handle('data:renameKnowledgeBase', async (_e, currentName, newName) => {
  const cfgPath = getConfigPath()
  const cfg = loadConfig(cfgPath, getRuntimeOptions())
  const renamed = renameKnowledgeBase(cfg.workspaceRoot, currentName, newName)
  if (!renamed.ok) return renamed
  if (cfg.selectedKnowledgeBase === toSafeKbName(currentName)) {
    const record = renamed.record
    cfg.selectedKnowledgeBase = record?.name || toSafeKbName(newName)
    cfg.selectedKnowledgeBaseId = record?.id || cfg.selectedKnowledgeBaseId
    cfg.knowledgeSources = record?.path ? [record.path] : cfg.knowledgeSources
    saveConfig(cfgPath, cfg, getRuntimeOptions())
  }
  return renamed
})

ipcMain.handle('data:pickMarkdownDirectory', async () => {
  const r = await dialog.showOpenDialog(win, {
    title: '选择 Markdown 根目录',
    properties: ['openDirectory']
  })
  if (r.canceled || !r.filePaths.length) return { ok: false, canceled: true }
  return { ok: true, path: r.filePaths[0] }
})

ipcMain.handle('data:importMarkdownFilesToKnowledgeBase', async (_e, kbName, files) => {
  const cfg = loadConfig(getConfigPath(), getRuntimeOptions())
  const safeName = toSafeKbName(kbName)
  if (!safeName) return { ok: false, error: '知识库名称不能为空' }
  const kbDir = path.join(cfg.workspaceRoot, safeName)
  if (!fs.existsSync(kbDir)) return { ok: false, error: `知识库不存在: ${safeName}` }
  const imported = importMarkdownFilesToKnowledgeBase(files || [], kbDir)
  return { ok: true, imported: imported.copied, kbDir }
})

ipcMain.handle('data:importMarkdownDirectoryToKnowledgeBase', async (_e, kbName, sourceDir) => {
  const cfg = loadConfig(getConfigPath(), getRuntimeOptions())
  const safeName = toSafeKbName(kbName)
  if (!safeName) return { ok: false, error: '知识库名称不能为空' }
  if (!sourceDir || !fs.existsSync(sourceDir)) return { ok: false, error: '源目录不存在' }
  const kbDir = path.join(cfg.workspaceRoot, safeName)
  if (!fs.existsSync(kbDir)) return { ok: false, error: `知识库不存在: ${safeName}` }
  const imported = importMarkdownDirectoryToKnowledgeBase(sourceDir, kbDir)
  return { ok: true, imported: imported.copied, scanned: imported.scanned, kbDir }
})

ipcMain.handle('rag:doctor', async () => {
  const cfg = loadConfig(getConfigPath(), getRuntimeOptions())
  return runDoctor(cfg)
})

ipcMain.handle('rag:index', async () => {
  const cfg = loadConfig(getConfigPath(), getRuntimeOptions())
  const result = await runIndex(cfg)
  if (result.ok && cfg.selectedKnowledgeBase) {
    markKnowledgeBaseIndexed(cfg.workspaceRoot, cfg.selectedKnowledgeBase, 'ready')
  } else if (cfg.selectedKnowledgeBase) {
    markKnowledgeBaseIndexed(cfg.workspaceRoot, cfg.selectedKnowledgeBase, 'failed')
  }
  return result
})

ipcMain.handle('rag:ask', async (_e, question) => {
  const cfg = loadConfig(getConfigPath(), getRuntimeOptions())
  return runAsk(cfg, question)
})

ipcMain.handle('rag:askStreamStart', async (event, question) => {
  const cfg = loadConfig(getConfigPath(), getRuntimeOptions())
  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const child = runAskStream(cfg, question, {
    onEvent: (payload) => {
      event.sender.send('rag:ask-stream', { requestId, ...payload })
    },
    onDone: (result) => {
      event.sender.send('rag:ask-stream', { requestId, event: 'exit', data: result })
      askStreams.delete(requestId)
    }
  })
  askStreams.set(requestId, child)
  return { ok: true, requestId }
})

ipcMain.handle('rag:askStreamCancel', async (_event, requestId) => {
  const child = askStreams.get(requestId)
  if (!child) return { ok: false, error: 'not found' }
  try {
    child.kill()
  } catch (_err) {
    return { ok: false, error: 'kill failed' }
  }
  askStreams.delete(requestId)
  return { ok: true }
})

app.whenReady().then(() => {
  app.setName('本地知识库助手')
  Menu.setApplicationMenu(null)
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
