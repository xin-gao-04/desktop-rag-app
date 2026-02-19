const fs = require('fs')
const path = require('path')
const os = require('os')
const { loadConfig, saveConfig } = require('../electron/lib/config-manager.cjs')
const { runDoctor, runIndex, runAsk } = require('../electron/lib/rag-runner.cjs')

function arg(name, fallback) {
  const idx = process.argv.indexOf(`--${name}`)
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback
  return process.argv[idx + 1]
}

async function main() {
  const root = path.resolve(__dirname, '..')
  const reportPath = path.resolve(arg('report', path.join(root, 'docs', 'smoke_report.md')))
  const question = arg('question', '请总结本地RAG执行流程，并说明知识库加载与卸载能力。')
  const kb = path.resolve(arg('kb', path.join(root, 'demo-kb')))
  const workdir = path.resolve(arg('workdir', path.join(root, 'rag-core')))
  const dbPath = path.resolve(arg('db', path.join(workdir, 'index.db')))
  const pythonExec = arg('python', 'python')
  const ollamaUrl = arg('ollama-url', 'http://127.0.0.1:11434')
  const vectorBackend = arg('vector-backend', 'sqlite')
  const qdrantUrl = arg('qdrant-url', 'http://127.0.0.1:6333')
  const qdrantApiKey = arg('qdrant-api-key', '')
  const qdrantCollection = arg('qdrant-collection', 'mdrag_chunks')
  const kbId = arg('kb-id', 'smoke-kb')
  const kbName = arg('kb-name', 'smoke-kb')
  const embeddingModel = arg('embedding-model', 'llama3.1:8b')
  const chatModel = arg('chat-model', 'llama3.1:8b')
  const chunkSize = Number(arg('chunk-size', '600')) || 600
  const chunkOverlap = Number(arg('chunk-overlap', '120')) || 120
  const embedTimeoutSec = Number(arg('embed-timeout-sec', '60')) || 60
  const chatTimeoutSec = Number(arg('chat-timeout-sec', '180')) || 180
  const cfgPath = path.join(os.tmpdir(), 'desktop-rag-smoke-config.json')

  if (!fs.existsSync(kb)) throw new Error(`knowledge path not found: ${kb}`)
  if (!fs.existsSync(workdir)) throw new Error(`mdrag workdir not found: ${workdir}`)

  const base = loadConfig(cfgPath)
  const cfg = {
    ...base,
    ollamaUrl,
    embeddingModel,
    chatModel,
    vectorBackend,
    qdrantUrl,
    qdrantApiKey,
    qdrantCollection,
    pythonExec,
    mdragWorkdir: workdir,
    dbPath,
    selectedKnowledgeBase: kbName,
    selectedKnowledgeBaseId: kbId,
    chunkSize: Math.max(100, Math.min(5000, Math.trunc(chunkSize))),
    chunkOverlap: Math.max(0, Math.min(2000, Math.trunc(chunkOverlap))),
    embedTimeoutSec: Math.max(10, Math.min(1200, Math.trunc(embedTimeoutSec))),
    chatTimeoutSec: Math.max(30, Math.min(1200, Math.trunc(chatTimeoutSec))),
    knowledgeSources: [kb]
  }
  saveConfig(cfgPath, cfg)

  const steps = []
  const stamp = new Date().toISOString()

  const doctor = await runDoctor(cfg)
  steps.push({ step: 'doctor', ok: !!doctor.ok, data: doctor })
  if (!doctor.ok) {
    return writeReportAndExit(reportPath, stamp, cfg, question, steps, false, 'doctor failed')
  }

  const indexRes = await runIndex(cfg)
  steps.push({ step: 'index', ok: !!indexRes.ok, data: indexRes })
  if (!indexRes.ok || !(indexRes.indexedChunks > 0)) {
    return writeReportAndExit(reportPath, stamp, cfg, question, steps, false, 'index failed or empty')
  }

  const askRes = await runAsk(cfg, question)
  const sourceCount = askRes.result?.sourceDetails?.length || 0
  const askOk = !!askRes.ok && sourceCount > 0
  steps.push({ step: 'ask', ok: askOk, data: askRes })
  if (!askOk) {
    const retriedCfg = {
      ...cfg,
      reranker: 'none',
      topK: 2,
      chunkSize: Math.min(400, cfg.chunkSize),
      chunkOverlap: Math.min(80, cfg.chunkOverlap),
      embedTimeoutSec: Math.max(30, cfg.embedTimeoutSec),
      maxContextChars: 1800,
      chatTimeoutSec: Math.max(120, cfg.chatTimeoutSec)
    }
    const retryQuestion = '请用三条要点总结本地RAG流程。'
    const retry = await runAsk(retriedCfg, retryQuestion)
    const retrySources = retry.result?.sourceDetails?.length || 0
    const retryOk = !!retry.ok && retrySources > 0
    steps.push({
      step: 'ask_retry',
      ok: retryOk,
      data: {
        configOverride: {
          reranker: retriedCfg.reranker,
          topK: retriedCfg.topK,
          chunkSize: retriedCfg.chunkSize,
          chunkOverlap: retriedCfg.chunkOverlap,
          maxContextChars: retriedCfg.maxContextChars,
          embedTimeoutSec: retriedCfg.embedTimeoutSec,
          chatTimeoutSec: retriedCfg.chatTimeoutSec
        },
        question: retryQuestion,
        result: retry
      }
    })
    if (!retryOk) {
      return writeReportAndExit(reportPath, stamp, cfg, question, steps, false, 'ask failed or no sources')
    }
  }

  return writeReportAndExit(reportPath, stamp, cfg, question, steps, true, 'ok')
}

function writeReportAndExit(reportPath, stamp, cfg, question, steps, pass, reason) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  let md = `# Smoke Report\n\n`
  md += `- time: ${stamp}\n`
  md += `- pass: ${pass}\n`
  md += `- reason: ${reason}\n`
  md += `- knowledge: ${cfg.knowledgeSources.join(', ')}\n`
  md += `- vectorBackend: ${cfg.vectorBackend}\n`
  if (cfg.vectorBackend === 'qdrant') {
    md += `- qdrant: ${cfg.qdrantUrl} / collection=${cfg.qdrantCollection}\n`
  }
  md += `- kb_id: ${cfg.selectedKnowledgeBaseId || cfg.selectedKnowledgeBase}\n`
  md += `- question: ${question}\n\n`
  for (const s of steps) {
    md += `## ${s.step}\n\n`
    md += `- ok: ${s.ok}\n\n`
    md += `\`\`\`json\n${JSON.stringify(s.data, null, 2)}\n\`\`\`\n\n`
  }
  fs.writeFileSync(reportPath, md, 'utf8')
  const summary = {
    pass,
    reason,
    reportPath,
    indexedChunks: steps.find((x) => x.step === 'index')?.data?.indexedChunks || 0,
    sourceCount: Math.max(
      steps.find((x) => x.step === 'ask')?.data?.result?.sourceDetails?.length || 0,
      steps.find((x) => x.step === 'ask_retry')?.data?.result?.result?.sourceDetails?.length || 0
    )
  }
  console.log(JSON.stringify(summary, null, 2))
  if (!pass) process.exit(2)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
