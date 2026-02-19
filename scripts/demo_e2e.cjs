const fs = require('fs')
const path = require('path')
const os = require('os')
const { loadConfig, saveConfig, addSource, removeSource } = require('../electron/lib/config-manager.cjs')
const { runDoctor, runIndex, runAsk } = require('../electron/lib/rag-runner.cjs')

async function main() {
  const root = path.resolve(__dirname, '..')
  const demoKb = path.join(root, 'demo-kb')
  const reportPath = path.join(root, 'docs', 'e2e_demo_report.md')
  const cfgPath = path.join(os.tmpdir(), 'desktop-rag-demo-config.json')

  const base = loadConfig(cfgPath)
  const cfg = {
    ...base,
    ollamaUrl: 'http://127.0.0.1:11434',
    embeddingModel: 'llama3.1:8b',
    chatModel: 'llama3.1:8b',
    pythonExec: 'python',
    mdragWorkdir: path.join(root, 'rag-core'),
    dbPath: path.join(root, 'rag-core', 'index.db'),
    knowledgeSources: []
  }
  saveConfig(cfgPath, cfg)

  const steps = []
  const stamp = new Date().toISOString()

  const doctor = await runDoctor(cfg)
  steps.push({ name: 'doctor', data: doctor })

  const afterAdd = addSource(cfgPath, demoKb)
  const cfgAdded = afterAdd.config
  steps.push({ name: 'addSource', data: { ok: true, sourceCount: cfgAdded.knowledgeSources.length, sources: cfgAdded.knowledgeSources } })

  const indexRes = await runIndex(cfgAdded)
  steps.push({ name: 'index', data: indexRes })

  const q = '请列出桌面端本地RAG的完整执行步骤，并说明数据加卸载能力。'
  const askRes = await runAsk(cfgAdded, q)
  steps.push({ name: 'ask', data: askRes })

  const afterRemove = removeSource(cfgPath, demoKb)
  steps.push({ name: 'removeSource', data: { ok: true, sourceCount: afterRemove.config.knowledgeSources.length } })

  let md = `# E2E Demo Report\n\nTimestamp: ${stamp}\n\n`
  for (const s of steps) {
    md += `## ${s.name}\n\n\`\`\`json\n${JSON.stringify(s.data, null, 2)}\n\`\`\`\n\n`
  }

  const pass = doctor.ok && indexRes.ok && askRes.ok && indexRes.indexedChunks > 0 && Array.isArray(askRes.result?.sources) && askRes.result.sources.length > 0
  md += `## Verdict\n\n- pass: ${pass}\n- indexedChunks: ${indexRes.indexedChunks}\n- sourcesReturned: ${askRes.result?.sources?.length || 0}\n`

  fs.writeFileSync(reportPath, md, 'utf8')
  console.log(reportPath)
  console.log(JSON.stringify({ pass, indexedChunks: indexRes.indexedChunks, sourcesReturned: askRes.result?.sources?.length || 0 }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
