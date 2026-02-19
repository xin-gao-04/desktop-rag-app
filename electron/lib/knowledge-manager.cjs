const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

function clearDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function nowIso() {
  return new Date().toISOString()
}

function makeKbId(seed = '') {
  return crypto.createHash('sha1').update(`${seed}:${Date.now()}:${Math.random()}`).digest('hex').slice(0, 12)
}

function toSafeKbName(name) {
  return String(name || '')
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function collectMarkdownFiles(root) {
  const out = []
  if (!fs.existsSync(root)) return out
  const stat = fs.statSync(root)
  if (stat.isFile()) {
    if (root.toLowerCase().endsWith('.md')) out.push(root)
    return out
  }
  const stack = [root]
  while (stack.length) {
    const current = stack.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const e of entries) {
      const full = path.join(current, e.name)
      if (e.isDirectory()) stack.push(full)
      else if (e.isFile() && full.toLowerCase().endsWith('.md')) out.push(full)
    }
  }
  return out
}

function buildMergedKnowledge(sources, outDir) {
  fs.mkdirSync(outDir, { recursive: true })
  const manifestPath = path.join(outDir, '.manifest.json')
  if (!fs.existsSync(manifestPath)) {
    clearDir(outDir)
  }
  const prev = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : { files: {} }
  const next = { files: {} }
  let copied = 0
  let unchanged = 0
  let removed = 0

  sources.forEach((src, idx) => {
    const files = collectMarkdownFiles(src)
    files.forEach((f) => {
      const base = path.basename(f)
      const rel = path.relative(src, f).replace(/[\\/]/g, '__')
      const hash = crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex')
      const key = `${idx}:${rel}`
      const short = crypto.createHash('sha1').update(key).digest('hex').slice(0, 10)
      const target = path.join(outDir, `${idx}_${short}_${base}`)
      next.files[key] = { hash, target, source: f }
      const old = prev.files[key]
      if (!old || old.hash !== hash || !fs.existsSync(target)) {
        fs.copyFileSync(f, target)
        copied++
      } else {
        unchanged++
      }
    })
  })

  for (const key of Object.keys(prev.files || {})) {
    if (!next.files[key]) {
      const t = prev.files[key].target
      if (t && fs.existsSync(t)) {
        fs.rmSync(t, { force: true })
        removed++
      }
    }
  }

  const liveTargets = new Set(Object.values(next.files).map((x) => x.target))
  const all = fs.readdirSync(outDir)
  for (const name of all) {
    const full = path.join(outDir, name)
    if (name === '.manifest.json') continue
    if (!liveTargets.has(full) && fs.statSync(full).isFile()) {
      fs.rmSync(full, { force: true })
      removed++
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(next, null, 2), 'utf8')
  return { copied, unchanged, removed, outDir }
}

function importMarkdownFilesToManagedDir(files, managedDir) {
  ensureDir(managedDir)
  let copied = 0
  files.forEach((f, idx) => {
    if (!fs.existsSync(f)) return
    if (!f.toLowerCase().endsWith('.md')) return
    const base = path.basename(f)
    const target = path.join(managedDir, `${Date.now()}_${idx}_${base}`)
    fs.copyFileSync(f, target)
    copied++
  })
  return { copied, managedDir }
}

function registryPath(workspaceRoot) {
  return path.join(workspaceRoot, 'knowledge_registry.json')
}

function listKbDirs(workspaceRoot) {
  ensureDir(workspaceRoot)
  return fs.readdirSync(workspaceRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
}

function loadRegistry(workspaceRoot) {
  ensureDir(workspaceRoot)
  const p = registryPath(workspaceRoot)
  if (!fs.existsSync(p)) {
    return { version: 1, updatedAt: nowIso(), items: [] }
  }
  try {
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'))
    const items = Array.isArray(raw.items) ? raw.items : []
    return { version: 1, updatedAt: raw.updatedAt || nowIso(), items }
  } catch {
    return { version: 1, updatedAt: nowIso(), items: [] }
  }
}

function saveRegistry(workspaceRoot, registry) {
  ensureDir(workspaceRoot)
  const p = registryPath(workspaceRoot)
  const next = {
    version: 1,
    updatedAt: nowIso(),
    items: Array.isArray(registry.items) ? registry.items : []
  }
  fs.writeFileSync(p, JSON.stringify(next, null, 2), 'utf8')
  return next
}

function toRecord(kbDir, name, prev = null) {
  const now = nowIso()
  const docCount = collectMarkdownFiles(kbDir).length
  return {
    id: prev?.id || makeKbId(name),
    name,
    path: kbDir,
    createdAt: prev?.createdAt || now,
    updatedAt: now,
    lastIndexedAt: prev?.lastIndexedAt || '',
    lastUsedAt: prev?.lastUsedAt || '',
    indexStatus: prev?.indexStatus || 'idle',
    docCount
  }
}

function syncKnowledgeRegistry(workspaceRoot) {
  const dirs = listKbDirs(workspaceRoot)
  const current = loadRegistry(workspaceRoot)
  const byName = new Map((current.items || []).map((x) => [x.name, x]))
  const next = []
  for (const name of dirs) {
    const kbDir = path.join(workspaceRoot, name)
    next.push(toRecord(kbDir, name, byName.get(name) || null))
  }
  next.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
  return saveRegistry(workspaceRoot, { items: next }).items
}

function listKnowledgeBases(workspaceRoot) {
  return syncKnowledgeRegistry(workspaceRoot)
}

function ensureKnowledgeBase(workspaceRoot, kbName) {
  const safeName = toSafeKbName(kbName)
  if (!safeName) {
    throw new Error('知识库名称不能为空')
  }
  ensureDir(workspaceRoot)
  const kbDir = path.join(workspaceRoot, safeName)
  ensureDir(kbDir)
  const readmePath = path.join(kbDir, 'README.md')
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(
      readmePath,
      `# ${safeName}\n\n该知识库目录用于存放 Markdown 文档。\n`,
      'utf8'
    )
  }
  ensureDefaultSeedDocs(kbDir, safeName)
  const list = syncKnowledgeRegistry(workspaceRoot)
  const created = list.find((x) => x.name === safeName)
  return created || { id: makeKbId(safeName), name: safeName, path: kbDir }
}

function ensureDefaultSeedDocs(kbDir, kbName) {
  if (kbName !== 'default') return
  const flowDoc = path.join(kbDir, '00_local_rag_flow.md')
  const opsDoc = path.join(kbDir, '01_data_load_unload.md')
  const doctorDoc = path.join(kbDir, '02_doctor_notes.md')

  if (!fs.existsSync(flowDoc)) {
    fs.writeFileSync(
      flowDoc,
      [
        '# 本地RAG完整流程',
        '',
        '本项目本地RAG标准流程：',
        '1. 添加 Markdown 文件到 `knowledge/` 目录。',
        '2. 运行 `index` 命令构建本地索引。',
        '3. 运行 `ask` 发起查询。',
        '',
        '桌面端对应流程：',
        '1. 健康检查（doctor）',
        '2. 配置并加载知识库',
        '3. 重建索引（index）',
        '4. 发起提问（ask）',
      ].join('\n'),
      'utf8'
    )
  }

  if (!fs.existsSync(opsDoc)) {
    fs.writeFileSync(
      opsDoc,
      [
        '# 数据加卸载能力',
        '',
        '加载能力：',
        '- 将 Markdown 文件添加到 `knowledge/` 目录中。',
        '- 在桌面端可通过“创建知识库向导”导入文件或目录。',
        '',
        '卸载能力：',
        '- 可在桌面端卸载当前知识库（不删除文件）。',
        '- 可删除指定知识库目录（彻底移除）。',
        '',
        '注意：每次数据变更后应重建索引。',
      ].join('\n'),
      'utf8'
    )
  }

  if (!fs.existsSync(doctorDoc)) {
    fs.writeFileSync(
      doctorDoc,
      [
        '# doctor 与索引修复',
        '',
        '- `doctor` 命令用于检测和修复本地索引环境。',
        '- 如果 `doctor` 失败，可执行：`python -m mdrag.cli doctor`。',
        '- 如果未找到 chunks，请检查知识目录中是否存在 `.md` 文件并重新执行 `index`。',
      ].join('\n'),
      'utf8'
    )
  }
}

function renameKnowledgeBase(workspaceRoot, currentName, newName) {
  const srcName = toSafeKbName(currentName)
  const dstName = toSafeKbName(newName)
  if (!srcName || !dstName) return { ok: false, error: '知识库名称不能为空' }
  if (srcName === dstName) return { ok: false, error: '新旧知识库名称相同' }
  const srcDir = path.join(workspaceRoot, srcName)
  const dstDir = path.join(workspaceRoot, dstName)
  if (!fs.existsSync(srcDir)) return { ok: false, error: `知识库不存在: ${srcName}` }
  if (fs.existsSync(dstDir)) return { ok: false, error: `目标名称已存在: ${dstName}` }
  fs.renameSync(srcDir, dstDir)
  const list = syncKnowledgeRegistry(workspaceRoot)
  const record = list.find((x) => x.name === dstName)
  return { ok: true, record, list }
}

function deleteKnowledgeBase(workspaceRoot, kbName) {
  const safeName = toSafeKbName(kbName)
  if (!safeName) return { ok: false }
  const kbDir = path.join(workspaceRoot, safeName)
  if (!fs.existsSync(kbDir)) return { ok: false }
  fs.rmSync(kbDir, { recursive: true, force: true })
  syncKnowledgeRegistry(workspaceRoot)
  return { ok: true, path: kbDir }
}

function markKnowledgeBaseIndexed(workspaceRoot, kbName, indexStatus = 'ready') {
  const list = syncKnowledgeRegistry(workspaceRoot)
  const item = list.find((x) => x.name === kbName)
  if (!item) return null
  item.lastIndexedAt = nowIso()
  item.indexStatus = indexStatus
  item.updatedAt = nowIso()
  item.docCount = collectMarkdownFiles(item.path).length
  const saved = saveRegistry(workspaceRoot, { items: list })
  return saved.items.find((x) => x.name === kbName) || null
}

function markKnowledgeBaseUsed(workspaceRoot, kbName) {
  const list = syncKnowledgeRegistry(workspaceRoot)
  const item = list.find((x) => x.name === kbName)
  if (!item) return null
  item.lastUsedAt = nowIso()
  item.updatedAt = nowIso()
  const saved = saveRegistry(workspaceRoot, { items: list })
  return saved.items.find((x) => x.name === kbName) || null
}

function importMarkdownFilesToKnowledgeBase(files, kbDir) {
  ensureDir(kbDir)
  let copied = 0
  files.forEach((f, idx) => {
    if (!fs.existsSync(f)) return
    if (!f.toLowerCase().endsWith('.md')) return
    const base = path.basename(f)
    const target = path.join(kbDir, `${Date.now()}_${idx}_${base}`)
    fs.copyFileSync(f, target)
    copied++
  })
  return { copied, kbDir }
}

function importMarkdownDirectoryToKnowledgeBase(sourceDir, kbDir) {
  ensureDir(kbDir)
  const files = collectMarkdownFiles(sourceDir)
  let copied = 0
  files.forEach((f, idx) => {
    const rel = path.relative(sourceDir, f).replace(/[\\/]/g, '__')
    const target = path.join(kbDir, `${idx}_${rel}`)
    fs.copyFileSync(f, target)
    copied++
  })
  return { copied, kbDir, scanned: files.length }
}

module.exports = {
  buildMergedKnowledge,
  collectMarkdownFiles,
  importMarkdownFilesToManagedDir,
  toSafeKbName,
  listKnowledgeBases,
  ensureKnowledgeBase,
  renameKnowledgeBase,
  deleteKnowledgeBase,
  markKnowledgeBaseIndexed,
  markKnowledgeBaseUsed,
  importMarkdownFilesToKnowledgeBase,
  importMarkdownDirectoryToKnowledgeBase
}
