const fs = require('fs')
const path = require('path')
const http = require('http')
const { spawnSync } = require('child_process')

/**
 * Fetch Ollama model list synchronously (best-effort, 2 s timeout).
 * Returns an array of model name strings, or [] on failure.
 */
function fetchOllamaModelNamesSync(ollamaUrl) {
  return new Promise((resolve) => {
    try {
      const u = new URL('/api/tags', ollamaUrl)
      const req = http.request(
        { hostname: u.hostname, port: u.port || 11434, path: u.pathname, method: 'GET', timeout: 2000 },
        (res) => {
          let buf = ''
          res.on('data', (d) => (buf += d))
          res.on('end', () => {
            try {
              const data = JSON.parse(buf)
              resolve((data.models || []).map((m) => m.name).filter(Boolean))
            } catch { resolve([]) }
          })
        }
      )
      req.on('error', () => resolve([]))
      req.on('timeout', () => { req.destroy(); resolve([]) })
      req.end()
    } catch { resolve([]) }
  })
}

function resolvePythonExec() {
  // On Windows 'python' is the standard entry point; on macOS/Linux 'python3'
  // is typically the only available command.
  const candidates = process.platform === 'win32'
    ? ['python', 'python3']
    : ['python3', 'python']
  for (const cmd of candidates) {
    try {
      const r = spawnSync(cmd, ['--version'], { timeout: 3000, encoding: 'utf8', shell: false })
      if (r.status === 0) return cmd
    } catch (_) { /* not found, try next */ }
  }
  return candidates[0] // best-effort fallback
}

function resolveDefaultWorkdir() {
  if (process.env.MDRAG_WORKDIR && fs.existsSync(process.env.MDRAG_WORKDIR)) {
    return process.env.MDRAG_WORKDIR
  }
  const bundled = process.resourcesPath ? path.join(process.resourcesPath, 'rag-core') : ''
  if (bundled && fs.existsSync(bundled)) {
    return bundled
  }
  const sibling = path.resolve(__dirname, '..', '..', '..', 'rag-core')
  if (fs.existsSync(sibling)) {
    return sibling
  }
  const cwd = path.resolve(process.cwd(), 'rag-core')
  if (fs.existsSync(cwd)) {
    return cwd
  }
  return sibling
}

function defaultConfig(runtimeOpts = {}) {
  const workdir = runtimeOpts.mdragWorkdir || resolveDefaultWorkdir()
  const dataRoot = runtimeOpts.dataRoot || workdir
  const workspaceRoot = path.join(dataRoot, 'knowledge_bases')
  const defaultKb = 'default'
  const defaultKbPath = path.join(workspaceRoot, defaultKb)
  return {
    ollamaUrl: 'http://127.0.0.1:11434',
    vectorBackend: 'qdrant',
    qdrantUrl: 'http://127.0.0.1:6333',
    qdrantApiKey: '',
    qdrantCollection: 'mdrag_chunks',
    embeddingModel: 'llama3.1:8b',
    chatModel: 'llama3.1:8b',
    pythonExec: resolvePythonExec(),
    mdragWorkdir: workdir,
    dbPath: path.join(dataRoot, 'index.db'),
    workspaceRoot,
    selectedKnowledgeBase: defaultKb,
    selectedKnowledgeBaseId: '',
    knowledgeSources: [defaultKbPath],
    retrievalStrategy: 'hybrid',
    chunkSize: 600,
    chunkOverlap: 120,
    denseCandidateMultiplier: 3,
    rrfK: 60,
    minRetrievalScore: 0,
    maxContextChars: 5000,
    bm25K1: 1.5,
    bm25B: 0.75,
    reranker: 'token_overlap',
    rerankTopN: 8,
    topK: 4,
    embedTimeoutSec: 60,
    chatTimeoutSec: 180,
    uiTheme: 'github-light',
    __meta: {
      lastSavedAt: ''
    }
  }
}

function ensureDir(filePath) {
  const d = path.dirname(filePath)
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })
}

function loadConfig(configPath, runtimeOpts = {}) {
  const base = defaultConfig(runtimeOpts)
  if (!fs.existsSync(configPath)) {
    ensureDir(configPath)
    fs.writeFileSync(configPath, JSON.stringify(base, null, 2), 'utf8')
    return base
  }
  const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  const merged = {
    ...base,
    ...raw,
    __meta: {
      ...base.__meta,
      ...(raw.__meta || {})
    }
  }
  merged.workspaceRoot = merged.workspaceRoot || base.workspaceRoot
  // If the saved pythonExec is a bare 'python' that doesn't actually exist on
  // this machine, override with the probed executable so the app works out of
  // the box on macOS/Linux without requiring manual config edits.
  if (merged.pythonExec) {
    try {
      const probe = spawnSync(merged.pythonExec, ['--version'], { timeout: 2000, encoding: 'utf8', shell: false })
      if (probe.status !== 0) merged.pythonExec = base.pythonExec
    } catch (_) {
      merged.pythonExec = base.pythonExec
    }
  } else {
    merged.pythonExec = base.pythonExec
  }
  if (!Object.prototype.hasOwnProperty.call(raw, 'selectedKnowledgeBase')) {
    merged.selectedKnowledgeBase = base.selectedKnowledgeBase
  }
  if (!Object.prototype.hasOwnProperty.call(raw, 'selectedKnowledgeBaseId')) {
    merged.selectedKnowledgeBaseId = base.selectedKnowledgeBaseId
  }
  merged.knowledgeSources = Array.isArray(merged.knowledgeSources) ? merged.knowledgeSources.filter(Boolean) : []
  if (!Object.prototype.hasOwnProperty.call(raw, 'topK')) {
    merged.topK = base.topK
  }
  if (!Object.prototype.hasOwnProperty.call(raw, 'chunkSize')) {
    merged.chunkSize = base.chunkSize
  }
  if (!Object.prototype.hasOwnProperty.call(raw, 'chunkOverlap')) {
    merged.chunkOverlap = base.chunkOverlap
  }
  if (!Object.prototype.hasOwnProperty.call(raw, 'embedTimeoutSec')) {
    merged.embedTimeoutSec = base.embedTimeoutSec
  }
  if (!Object.prototype.hasOwnProperty.call(raw, 'chatTimeoutSec')) {
    merged.chatTimeoutSec = base.chatTimeoutSec
  }
  if (!Object.prototype.hasOwnProperty.call(raw, 'uiTheme')) {
    merged.uiTheme = base.uiTheme
  }
  if (!Object.prototype.hasOwnProperty.call(raw, 'vectorBackend')) {
    merged.vectorBackend = base.vectorBackend
  }
  if (!Object.prototype.hasOwnProperty.call(raw, 'qdrantUrl')) {
    merged.qdrantUrl = base.qdrantUrl
  }
  if (!Object.prototype.hasOwnProperty.call(raw, 'qdrantApiKey')) {
    merged.qdrantApiKey = base.qdrantApiKey
  }
  if (!Object.prototype.hasOwnProperty.call(raw, 'qdrantCollection')) {
    merged.qdrantCollection = base.qdrantCollection
  }
  return merged
}

function saveConfig(configPath, cfg, runtimeOpts = {}) {
  const current = loadConfig(configPath, runtimeOpts)
  const next = { ...current, ...cfg }
  next.__meta = {
    ...(next.__meta || {}),
    lastSavedAt: new Date().toISOString()
  }
  ensureDir(configPath)
  fs.writeFileSync(configPath, JSON.stringify(next, null, 2), 'utf8')
  return { ok: true, config: next }
}

function addSource(configPath, sourcePath, runtimeOpts = {}) {
  const current = loadConfig(configPath, runtimeOpts)
  if (!current.knowledgeSources.includes(sourcePath)) {
    current.knowledgeSources.push(sourcePath)
  }
  return saveConfig(configPath, current, runtimeOpts)
}

function removeSource(configPath, sourcePath, runtimeOpts = {}) {
  const current = loadConfig(configPath, runtimeOpts)
  current.knowledgeSources = current.knowledgeSources.filter((p) => p !== sourcePath)
  return saveConfig(configPath, current, runtimeOpts)
}

/**
 * If the configured embedding/chat model names are not present in the Ollama
 * instance, replace them with the first available model and persist the fix.
 * This prevents "model not found" 404 errors for users who never changed the
 * default model names.
 *
 * @param {string} configPath  Path to config.json
 * @param {object} cfg         Already-loaded config object (mutated in place)
 * @param {object} runtimeOpts Runtime options forwarded to saveConfig
 * @returns {Promise<object>}  The (possibly updated) cfg
 */
async function autoFixModelNames(configPath, cfg, runtimeOpts = {}) {
  const models = await fetchOllamaModelNamesSync(cfg.ollamaUrl || 'http://127.0.0.1:11434')
  if (!models.length) return cfg  // Ollama unreachable – leave as-is

  const modelSet = new Set(models)
  const fallback = models[0]
  let changed = false

  if (!modelSet.has(cfg.embeddingModel)) {
    cfg.embeddingModel = fallback
    changed = true
  }
  if (!modelSet.has(cfg.chatModel)) {
    cfg.chatModel = fallback
    changed = true
  }

  if (changed) {
    saveConfig(configPath, cfg, runtimeOpts)
  }
  return cfg
}

module.exports = {
  defaultConfig,
  loadConfig,
  saveConfig,
  addSource,
  removeSource,
  autoFixModelNames
}
