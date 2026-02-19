# Smoke Report

- time: 2026-02-17T11:52:29.930Z
- pass: false
- reason: index failed or empty
- knowledge: D:\code\desktop-rag-app\demo-kb
- vectorBackend: qdrant
- qdrant: http://127.0.0.1:6333 / collection=mdrag_chunks
- kb_id: smoke-qdrant
- question: 请总结本地RAG执行流程，并说明知识库加载与卸载能力。

## doctor

- ok: true

```json
{
  "ok": true,
  "models": [
    "llama3.1:8b",
    "qwen2.5-coder:3b",
    "qwen2.5-coder:0.5b-fastcode",
    "qwen2.5-coder:0.5b",
    "qwen2.5-coder:1.5b"
  ],
  "vectorConfig": {
    "vectorBackend": "qdrant",
    "qdrantUrl": "http://127.0.0.1:6333",
    "qdrantApiKey": "",
    "qdrantCollection": "mdrag_chunks",
    "kbId": "smoke-qdrant"
  },
  "qdrant": {
    "ok": true,
    "detail": "qdrant collections ok (mdrag_chunks)"
  },
  "raw": "models=5"
}
```

## index

- ok: false

```json
{
  "ok": false,
  "indexedChunks": 0,
  "mergedFiles": 0,
  "unchangedFiles": 3,
  "removedFiles": 0,
  "vectorConfig": {
    "vectorBackend": "qdrant",
    "qdrantUrl": "http://127.0.0.1:6333",
    "qdrantApiKey": "",
    "qdrantCollection": "mdrag_chunks",
    "kbId": "smoke-qdrant"
  },
  "retrievalConfig": {
    "chunkSize": 600,
    "chunkOverlap": 120,
    "topK": 4,
    "embedTimeoutSec": 60,
    "chatTimeoutSec": 180,
    "retrievalStrategy": "hybrid",
    "denseCandidateMultiplier": 3,
    "rrfK": 60,
    "minRetrievalScore": 0,
    "maxContextChars": 5000,
    "bm25K1": 1.5,
    "bm25B": 0.75,
    "reranker": "token_overlap",
    "rerankTopN": 8
  },
  "raw": "Traceback (most recent call last):\r\n  File \"C:\\Users\\gaoxx\\AppData\\Local\\Programs\\Python\\Python39\\lib\\runpy.py\", line 197, in _run_module_as_main\r\n    return _run_code(code, main_globals, None,\r\n  File \"C:\\Users\\gaoxx\\AppData\\Local\\Programs\\Python\\Python39\\lib\\runpy.py\", line 87, in _run_code\r\n    exec(code, run_globals)\r\n  File \"D:\\code\\md-rag-ollama-local\\src\\mdrag\\cli.py\", line 162, in <module>\r\n    raise SystemExit(main())\r\n  File \"D:\\code\\md-rag-ollama-local\\src\\mdrag\\cli.py\", line 158, in main\r\n    return int(args.func(args))\r\n  File \"D:\\code\\md-rag-ollama-local\\src\\mdrag\\cli.py\", line 58, in cmd_index\r\n    n = pipeline.build_index(args.knowledge_dir, clear_first=args.clear_first)\r\n  File \"D:\\code\\md-rag-ollama-local\\src\\mdrag\\pipeline.py\", line 187, in build_index\r\n    return self.store.upsert_chunks(chunks, vectors, kb_id=self.config.kb_id)\r\n  File \"D:\\code\\md-rag-ollama-local\\src\\mdrag\\qdrant_store.py\", line 135, in upsert_chunks\r\n    self._rest(\r\n  File \"D:\\code\\md-rag-ollama-local\\src\\mdrag\\qdrant_store.py\", line 39, in _rest\r\n    resp.raise_for_status()\r\n  File \"C:\\Users\\gaoxx\\AppData\\Local\\Programs\\Python\\Python39\\lib\\site-packages\\requests\\models.py\", line 1024, in raise_for_status\r\n    raise HTTPError(http_error_msg, response=self)\r\nrequests.exceptions.HTTPError: 400 Client Error: Bad Request for url: http://127.0.0.1:6333/collections/mdrag_chunks/points\r\n"
}
```

