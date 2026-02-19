import { describe, it, expect } from 'vitest'
const fs = require('fs')
const os = require('os')
const path = require('path')
const {
  buildMergedKnowledge,
  ensureKnowledgeBase,
  listKnowledgeBases,
  renameKnowledgeBase
} = require('../electron/lib/knowledge-manager.cjs')

describe('knowledge manager', () => {
  it('merges markdown files from sources', () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ragapp-'))
    const s1 = path.join(base, 's1')
    const s2 = path.join(base, 's2')
    const out = path.join(base, 'out')
    fs.mkdirSync(s1, { recursive: true })
    fs.mkdirSync(s2, { recursive: true })
    fs.writeFileSync(path.join(s1, 'a.md'), '# A', 'utf8')
    fs.writeFileSync(path.join(s2, 'b.md'), '# B', 'utf8')
    const res = buildMergedKnowledge([s1, s2], out)
    expect(res.copied).toBe(2)
    const files = fs.readdirSync(out).filter((n) => n !== '.manifest.json')
    expect(files.length).toBe(2)
  })

  it('seeds default kb with flow docs', () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ragapp-kb-'))
    const workspace = path.join(base, 'knowledge_bases')
    const kb = ensureKnowledgeBase(workspace, 'default')
    const files = fs.readdirSync(kb.path)
    expect(files.includes('00_local_rag_flow.md')).toBe(true)
    expect(files.includes('01_data_load_unload.md')).toBe(true)
    expect(files.includes('02_doctor_notes.md')).toBe(true)
  })

  it('maintains kb registry records and rename', () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ragapp-reg-'))
    const workspace = path.join(base, 'knowledge_bases')
    const kb = ensureKnowledgeBase(workspace, 'default')
    expect(kb.id).toBeTruthy()
    const list1 = listKnowledgeBases(workspace)
    expect(Array.isArray(list1)).toBe(true)
    expect(list1[0].name).toBe('default')
    const renamed = renameKnowledgeBase(workspace, 'default', 'project-a')
    expect(renamed.ok).toBe(true)
    const list2 = listKnowledgeBases(workspace)
    expect(list2.some((x) => x.name === 'project-a')).toBe(true)
  })
})
