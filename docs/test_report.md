# Test Report

Timestamp: 2026-02-15T02:15:12.4153001+08:00

## Unit Tests (desktop-rag-app)
`

> desktop-rag-app@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90mD:/code/desktop-rag-app[39m

 [32m✓[39m tests/config-manager.test.cjs [2m([22m[2m1 test[22m[2m)[22m[90m 8[2mms[22m[39m
 [32m✓[39m tests/knowledge-manager.test.cjs [2m([22m[2m1 test[22m[2m)[22m[90m 16[2mms[22m[39m
 [32m✓[39m tests/rag-runner.test.cjs [2m([22m[2m1 test[22m[2m)[22m[90m 2[2mms[22m[39m

[2m Test Files [22m [1m[32m3 passed[39m[22m[90m (3)[39m
[2m      Tests [22m [1m[32m3 passed[39m[22m[90m (3)[39m
[2m   Start at [22m 02:15:11
[2m   Duration [22m 849ms[2m (transform 55ms, setup 0ms, collect 95ms, tests 27ms, environment 1ms, prepare 893ms)[22m

`

## Local Ollama Smoke (md-rag-ollama-local)
### Doctor
`
ollama_health=True
models=
- llama3.1:8b
- qwen2.5-coder:3b
- qwen2.5-coder:0.5b-fastcode
- qwen2.5-coder:0.5b
- qwen2.5-coder:1.5b
`

### Index
`
indexed_chunks=3
`

### Ask
`
{
  "question": "�г�����RAGִ�в���",
  "answer": "�г�����RAGִ�в������£�\n\n1. ȷ��ģ���б���`ollama list`\n2. ����ģ��·����`$env:PYTHONPATH = \"$PWD\\\\src\"`\n3. �����ĵ���`python -m mdrag.cli index --knowledge-dir .\\\\knowledge --db .\\\\index.db --embedding-model llama3.1:8b --chat-model llama3.1:8b --clear-first`\n4. ���ʣ�`python -m mdrag.cli ask --db .\\\\index.db --question \"What is the local flow?\" --embedding-model llama3.1:8b --chat-model llama3.1:8b`",
  "sources": [
    "knowledge\\README.md",
    "knowledge\\local_deploy.md",
    "knowledge\\local_deploy.md"
  ],
  "scores": [
    0.16257763603033307,
    0.08137386714477393,
    -0.01391834465689366
  ]
}
`

## Result
- Desktop app core unit tests passed.
- Local Ollama connection/query flow passed via reused Python RAG core.
- End-to-end desktop integration path is ready (IPC -> Python CLI -> Ollama).
