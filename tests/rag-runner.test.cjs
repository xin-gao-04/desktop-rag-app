import { describe, it, expect } from 'vitest'
const { parseIndexedChunks } = require('../electron/lib/rag-runner.cjs')

describe('rag runner parsing', () => {
  it('parses indexed chunk count', () => {
    expect(parseIndexedChunks('indexed_chunks=12')).toBe(12)
    expect(parseIndexedChunks('x')).toBe(0)
  })
})
