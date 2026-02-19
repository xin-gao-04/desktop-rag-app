const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

function hasCmd(name) {
  return new Promise((resolve) => {
    const child = spawn('where', [name], { shell: true })
    child.on('close', (code) => resolve(code === 0))
    child.on('error', () => resolve(false))
  })
}

function httpGet(url, timeoutMs = 3000) {
  return new Promise((resolve) => {
    try {
      const lib = url.startsWith('https') ? require('https') : require('http')
      const req = lib.get(url, { timeout: timeoutMs }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 300)
      })
      req.on('error', () => resolve(false))
      req.on('timeout', () => {
        req.destroy()
        resolve(false)
      })
    } catch {
      resolve(false)
    }
  })
}

function resolveSetupScript(mode = 'online') {
  const scriptName = mode === 'offline' ? 'setup-offline-runtime.ps1' : 'setup-min-runtime.ps1'
  const candidates = [
    path.resolve(__dirname, '..', '..', 'installer', 'windows', scriptName),
    path.join(process.resourcesPath || '', 'installer', 'windows', scriptName),
    path.join(process.resourcesPath || '', 'app.asar.unpacked', 'installer', 'windows', scriptName),
  ]
  for (const p of candidates) {
    if (p && fs.existsSync(p)) return p
  }
  return ''
}

async function getRuntimeStatus() {
  const [python, docker, ollama] = await Promise.all([hasCmd('python'), hasCmd('docker'), hasCmd('ollama')])
  const qdrant = await httpGet('http://127.0.0.1:6333/collections', 3000)
  return {
    ok: true,
    python,
    docker,
    ollama,
    qdrant,
    scriptPath: resolveSetupScript('online'),
    offlineScriptPath: resolveSetupScript('offline')
  }
}

function setupRuntime(options = {}) {
  const mode = options.offline ? 'offline' : 'online'
  const scriptPath = resolveSetupScript(mode)
  if (!scriptPath) {
    return Promise.resolve({ ok: false, error: mode === 'offline' ? '未找到 setup-offline-runtime.ps1' : '未找到 setup-min-runtime.ps1' })
  }
  const args = [
    '-ExecutionPolicy', 'Bypass',
    '-File', scriptPath,
    '-InstallPython', String(!!options.installPython).toLowerCase(),
    '-InstallDocker', String(!!options.installDocker).toLowerCase(),
    '-InstallOllama', String(!!options.installOllama).toLowerCase(),
    '-StartQdrant', String(!!options.startQdrant).toLowerCase(),
    '-PullModel', String(!!options.pullModel).toLowerCase(),
    '-ModelName', String(options.modelName || 'llama3.1:8b')
  ]
  if (mode === 'offline' && options.assetRoot) {
    args.push('-AssetRoot', String(options.assetRoot))
  }

  return new Promise((resolve) => {
    const child = spawn('powershell', args, { shell: true })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (d) => { stdout += d.toString() })
    child.stderr.on('data', (d) => { stderr += d.toString() })
    child.on('error', (err) => resolve({ ok: false, error: err.message || String(err), stdout, stderr }))
    child.on('close', (code) => {
      resolve({
        ok: code === 0,
        code,
        stdout,
        stderr,
        scriptPath
      })
    })
  })
}

module.exports = {
  getRuntimeStatus,
  setupRuntime
}
