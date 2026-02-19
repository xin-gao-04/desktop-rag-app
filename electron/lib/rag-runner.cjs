const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const http = require('http')
const https = require('https')
const { buildMergedKnowledge } = require('./knowledge-manager.cjs')

function runCommand(cmd, args, cwd, extraEnv = {}) {
  const env = { ...process.env, ...extraEnv }
  const runOnce = (useShell) => new Promise((resolve, reject) => {
    let child
    try {
      child = spawn(cmd, args, {
        cwd,
        shell: useShell,
        env
      })
    } catch (err) {
      return reject(err)
    }
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (d) => (stdout += d.toString()))
    child.stderr.on('data', (d) => (stderr += d.toString()))
    child.on('error', (err) => reject(err))
    child.on('close', (code) => resolve({ code, stdout, stderr }))
  })

  return runOnce(false).catch(() => runOnce(true))
}

function spawnCommand(cmd, args, cwd, extraEnv = {}) {
  const env = { ...process.env, ...extraEnv }
  return spawn(cmd, args, {
    cwd,
    shell: false,
    env
  })
}

function buildPythonEnv(cfg) {
  const srcPath = path.join(cfg.mdragWorkdir, 'src')
  const existing = process.env.PYTHONPATH ? `${process.env.PYTHONPATH};${srcPath}` : srcPath
  return {
    PYTHONPATH: existing,
    PYTHONUTF8: '1',
    PYTHONIOENCODING: 'utf-8'
  }
}

function parseIndexedChunks(output) {
  const m = output.match(/indexed_chunks=(\d+)/)
  return m ? Number(m[1]) : 0
}

function asInt(value, fallback, min, max) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  const v = Math.trunc(n)
  if (typeof min === 'number' && v < min) return min
  if (typeof max === 'number' && v > max) return max
  return v
}

function asFloat(value, fallback, min, max) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  if (typeof min === 'number' && n < min) return min
  if (typeof max === 'number' && n > max) return max
  return n
}

function normalizeRetrievalConfig(cfg) {
  const strategy = String(cfg.retrievalStrategy || 'hybrid').toLowerCase()
  const reranker = String(cfg.reranker || 'token_overlap').toLowerCase()
  return {
    chunkSize: asInt(cfg.chunkSize, 600, 100, 5000),
    chunkOverlap: asInt(cfg.chunkOverlap, 120, 0, 2000),
    topK: asInt(cfg.topK, 4, 1, 20),
    embedTimeoutSec: asInt(cfg.embedTimeoutSec, 60, 10, 1200),
    chatTimeoutSec: asInt(cfg.chatTimeoutSec, 180, 30, 1200),
    retrievalStrategy: ['hybrid', 'dense', 'sparse'].includes(strategy) ? strategy : 'hybrid',
    denseCandidateMultiplier: asInt(cfg.denseCandidateMultiplier, 3, 1, 20),
    rrfK: asInt(cfg.rrfK, 60, 1, 500),
    minRetrievalScore: asFloat(cfg.minRetrievalScore, 0, 0, 1),
    maxContextChars: asInt(cfg.maxContextChars, 5000, 500, 100000),
    bm25K1: asFloat(cfg.bm25K1, 1.5, 0.1, 5),
    bm25B: asFloat(cfg.bm25B, 0.75, 0, 1),
    reranker: ['token_overlap', 'llm_score', 'none'].includes(reranker) ? reranker : 'token_overlap',
    rerankTopN: asInt(cfg.rerankTopN, 8, 1, 100)
  }
}

function normalizeVectorConfig(cfg) {
  const backend = String(cfg.vectorBackend || 'sqlite').toLowerCase()
  return {
    vectorBackend: backend === 'qdrant' ? 'qdrant' : 'sqlite',
    qdrantUrl: String(cfg.qdrantUrl || 'http://127.0.0.1:6333'),
    qdrantApiKey: String(cfg.qdrantApiKey || ''),
    qdrantCollection: String(cfg.qdrantCollection || 'mdrag_chunks'),
    kbId: String(cfg.selectedKnowledgeBaseId || cfg.selectedKnowledgeBase || 'default')
  }
}

function appendRetrievalArgs(args, cfg) {
  const n = normalizeRetrievalConfig(cfg)
  args.push('--chunk-size', String(n.chunkSize))
  args.push('--chunk-overlap', String(n.chunkOverlap))
  args.push('--top-k', String(n.topK))
  args.push('--embed-timeout-sec', String(n.embedTimeoutSec))
  args.push('--chat-timeout-sec', String(n.chatTimeoutSec))
  args.push('--retrieval-strategy', n.retrievalStrategy)
  args.push('--dense-candidate-multiplier', String(n.denseCandidateMultiplier))
  args.push('--rrf-k', String(n.rrfK))
  args.push('--min-retrieval-score', String(n.minRetrievalScore))
  args.push('--max-context-chars', String(n.maxContextChars))
  args.push('--bm25-k1', String(n.bm25K1))
  args.push('--bm25-b', String(n.bm25B))
  args.push('--reranker', n.reranker)
  args.push('--rerank-top-n', String(n.rerankTopN))
  return n
}

function appendVectorArgs(args, cfg) {
  const v = normalizeVectorConfig(cfg)
  args.push('--vector-backend', v.vectorBackend)
  args.push('--qdrant-url', v.qdrantUrl)
  args.push('--qdrant-api-key', v.qdrantApiKey)
  args.push('--qdrant-collection', v.qdrantCollection)
  args.push('--kb-id', v.kbId)
  return v
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function enrichSources(result) {
  const dedup = new Map()
  const sources = result.sources || []
  const scores = result.scores || []
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]
    let snippet = ''
    let key = source || `unknown-${i}`
    if (source && fs.existsSync(source)) {
      const content = fs.readFileSync(source, 'utf8')
      snippet = buildSnippet(content, 360)
      key = source.toLowerCase()
    }
    const score = scores[i] ?? 0
    const prev = dedup.get(key)
    if (!prev || score > prev.score) {
      dedup.set(key, { source, score, snippet })
    }
  }
  const details = Array.from(dedup.values()).sort((a, b) => b.score - a.score).slice(0, 6)
  result.sources = details.map((x) => x.source)
  result.scores = details.map((x) => x.score)
  result.sourceDetails = details
  return result
}

function buildSnippet(content, maxLen = 360) {
  const text = String(content || '')
    .replace(/\uFEFF/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  if (!text) return ''
  if (text.length <= maxLen) return text
  const cut = text.slice(0, maxLen)
  const lastBreak = Math.max(cut.lastIndexOf('\n'), cut.lastIndexOf('。'), cut.lastIndexOf('. '), cut.lastIndexOf('；'))
  const body = lastBreak > Math.floor(maxLen * 0.6) ? cut.slice(0, lastBreak + 1) : cut
  return `${body.trim()}\n…`
}

async function runDoctor(cfg) {
  const vectorConfig = normalizeVectorConfig(cfg)
  try {
    const models = await fetchOllamaModels(cfg.ollamaUrl)
    const qdrant = vectorConfig.vectorBackend === 'qdrant' ? await fetchQdrantHealth(vectorConfig) : { ok: true, detail: 'sqlite mode' }
    return { ok: true, models, vectorConfig, qdrant, raw: `models=${models.length}` }
  } catch (e) {
    const args = ['-m', 'mdrag.cli', 'doctor', '--ollama-url', cfg.ollamaUrl]
    const res = await runCommand(cfg.pythonExec, args, cfg.mdragWorkdir, buildPythonEnv(cfg))
    const models = res.stdout
      .split('\n')
      .map((x) => x.trim())
      .filter((x) => x.startsWith('- '))
      .map((x) => x.slice(2))
    const qdrant = vectorConfig.vectorBackend === 'qdrant' ? await fetchQdrantHealth(vectorConfig) : { ok: true, detail: 'sqlite mode' }
    return { ok: res.code === 0, models, vectorConfig, qdrant, raw: res.stdout || res.stderr }
  }
}

function fetchOllamaModels(baseUrl) {
  return new Promise((resolve, reject) => {
    const u = new URL('/api/tags', baseUrl)
    const lib = u.protocol === 'https:' ? https : http
    const req = lib.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        method: 'GET',
        timeout: 8000
      },
      (res) => {
        let buf = ''
        res.on('data', (d) => (buf += d.toString()))
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`status=${res.statusCode}`))
            return
          }
          try {
            const data = JSON.parse(buf)
            const models = (data.models || [])
              .map((m) => m && m.name)
              .filter((x) => typeof x === 'string' && x.trim().length > 0)
            resolve(models)
          } catch (err) {
            reject(err)
          }
        })
      }
    )
    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy(new Error('timeout'))
    })
    req.end()
  })
}

function fetchQdrantHealth(vectorConfig) {
  return new Promise((resolve) => {
    try {
      const u = new URL('/collections', vectorConfig.qdrantUrl)
      const lib = u.protocol === 'https:' ? https : http
      const headers = {}
      if (vectorConfig.qdrantApiKey) headers['api-key'] = vectorConfig.qdrantApiKey
      const req = lib.request(
        {
          hostname: u.hostname,
          port: u.port,
          path: u.pathname + u.search,
          method: 'GET',
          timeout: 5000,
          headers
        },
        (res) => {
          let buf = ''
          res.on('data', (d) => (buf += d.toString()))
          res.on('end', () => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
              resolve({ ok: false, detail: `qdrant status=${res.statusCode}` })
              return
            }
            resolve({ ok: true, detail: `qdrant collections ok (${vectorConfig.qdrantCollection})` })
          })
        }
      )
      req.on('error', (err) => resolve({ ok: false, detail: err.message || String(err) }))
      req.on('timeout', () => req.destroy(new Error('qdrant timeout')))
      req.end()
    } catch (err) {
      resolve({ ok: false, detail: err.message || String(err) })
    }
  })
}

async function runIndex(cfg) {
  const mergedDir = path.join(cfg.mdragWorkdir, '.merged_knowledge')
  const merged = buildMergedKnowledge(cfg.knowledgeSources || [], mergedDir)
  const args = [
    '-m', 'mdrag.cli', 'index',
    '--knowledge-dir', mergedDir,
    '--db', cfg.dbPath,
    '--embedding-model', cfg.embeddingModel,
    '--chat-model', cfg.chatModel,
    '--clear-first'
  ]
  const vectorConfig = appendVectorArgs(args, cfg)
  const retrievalConfig = appendRetrievalArgs(args, cfg)
  const res = await runCommand(cfg.pythonExec, args, cfg.mdragWorkdir, buildPythonEnv(cfg))
  return {
    ok: res.code === 0,
    indexedChunks: parseIndexedChunks(res.stdout),
    mergedFiles: merged.copied,
    unchangedFiles: merged.unchanged,
    removedFiles: merged.removed,
    vectorConfig,
    retrievalConfig,
    raw: res.stdout || res.stderr
  }
}

async function runAsk(cfg, question) {
  const args = [
    '-m', 'mdrag.cli', 'ask',
    '--db', cfg.dbPath,
    '--question', question,
    '--embedding-model', cfg.embeddingModel,
    '--chat-model', cfg.chatModel
  ]
  appendVectorArgs(args, cfg)
  appendRetrievalArgs(args, cfg)
  const res = await runCommand(cfg.pythonExec, args, cfg.mdragWorkdir, buildPythonEnv(cfg))
  if (res.code !== 0) {
    return { ok: false, error: res.stderr || res.stdout }
  }
  const parsed = safeJsonParse(res.stdout)
  if (!parsed) return { ok: false, error: 'Invalid JSON result', raw: res.stdout }
  return { ok: true, result: enrichSources(parsed) }
}

function runAskStream(cfg, question, handlers = {}) {
  const args = [
    '-m', 'mdrag.cli', 'ask-stream',
    '--db', cfg.dbPath,
    '--question', question,
    '--embedding-model', cfg.embeddingModel,
    '--chat-model', cfg.chatModel
  ]
  appendVectorArgs(args, cfg)
  appendRetrievalArgs(args, cfg)
  const child = spawnCommand(cfg.pythonExec, args, cfg.mdragWorkdir, buildPythonEnv(cfg))
  let stdoutBuf = ''
  let stderr = ''

  child.stdout.on('data', (d) => {
    stdoutBuf += d.toString()
    let idx
    while ((idx = stdoutBuf.indexOf('\n')) >= 0) {
      const line = stdoutBuf.slice(0, idx).trim()
      stdoutBuf = stdoutBuf.slice(idx + 1)
      if (!line) continue
      const evt = safeJsonParse(line)
      if (!evt) continue
      if (evt.event === 'done' && evt.data) {
        evt.data = enrichSources(evt.data)
      }
      if (handlers.onEvent) handlers.onEvent(evt)
    }
  })
  child.stderr.on('data', (d) => {
    stderr += d.toString()
    if (handlers.onErrorChunk) handlers.onErrorChunk(d.toString())
  })
  child.on('error', (err) => {
    if (handlers.onDone) handlers.onDone({ ok: false, error: err.message || String(err) })
  })
  child.on('close', (code) => {
    if (code !== 0) {
      if (handlers.onDone) handlers.onDone({ ok: false, error: stderr || `ask-stream failed: code=${code}` })
      return
    }
    if (handlers.onDone) handlers.onDone({ ok: true })
  })
  return child
}

module.exports = {
  runCommand,
  parseIndexedChunks,
  runDoctor,
  runIndex,
  runAsk,
  runAskStream
}
