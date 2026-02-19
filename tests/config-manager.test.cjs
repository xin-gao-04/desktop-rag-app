import { describe, it, expect } from 'vitest'
const fs = require('fs')
const os = require('os')
const path = require('path')
const { loadConfig, addSource, removeSource } = require('../electron/lib/config-manager.cjs')

describe('config manager', () => {
  it('creates default config and add/remove source', () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), 'cfg-'))
    const cfgPath = path.join(base, 'config.json')
    const cfg = loadConfig(cfgPath)
    expect(cfg.ollamaUrl).toContain('127.0.0.1')
    expect(cfg.uiTheme).toBe('github-light')
    expect(cfg.vectorBackend).toBe('qdrant')
    expect(cfg.qdrantCollection).toBe('mdrag_chunks')

    const a = addSource(cfgPath, 'D:\\data\\kb1')
    expect(a.config.knowledgeSources.includes('D:\\data\\kb1')).toBe(true)

    const b = removeSource(cfgPath, 'D:\\data\\kb1')
    expect(b.config.knowledgeSources.includes('D:\\data\\kb1')).toBe(false)
  })
})
