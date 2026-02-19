# Smoke Report

- time: 2026-02-18T05:07:53.446Z
- pass: true
- reason: ok
- knowledge: D:\code\desktop-rag-app\demo-kb
- vectorBackend: qdrant
- qdrant: http://127.0.0.1:6333 / collection=mdrag_chunks
- kb_id: smoke-offline-latest
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
    "kbId": "smoke-offline-latest"
  },
  "qdrant": {
    "ok": true,
    "detail": "qdrant collections ok (mdrag_chunks)"
  },
  "raw": "models=5"
}
```

## index

- ok: true

```json
{
  "ok": true,
  "indexedChunks": 3,
  "mergedFiles": 0,
  "unchangedFiles": 3,
  "removedFiles": 0,
  "vectorConfig": {
    "vectorBackend": "qdrant",
    "qdrantUrl": "http://127.0.0.1:6333",
    "qdrantApiKey": "",
    "qdrantCollection": "mdrag_chunks",
    "kbId": "smoke-offline-latest"
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
  "raw": "indexed_chunks=3\r\n"
}
```

## ask

- ok: true

```json
{
  "ok": true,
  "result": {
    "question": "请总结本地RAG执行流程，并说明知识库加载与卸载能力。",
    "answer": "根据提供的上下文信息，以下是关于本地RAG执行流程和知识库加载与卸载能力的总结：\n\n**本地RAG执行流程：**\n\n* 健康检查（doctor）\n* 配置知识目录\n* 重建索引（index）\n* 发起查询（ask）\n\n**知识库加载与卸载能力：**\n\n* 可添加多个知识目录\n* 可按目录移除\n* 每次变更后建议重建索引\n\n请注意，提供的上下文信息中已经涵盖了本地RAG的标准流程和知识库管理能力。",
    "sources": [
      "D:\\code\\desktop-rag-app\\release\\win-unpacked\\resources\\md-rag-ollama-local\\.merged_knowledge\\0_582e9bb37a_data_ops.md",
      "D:\\code\\desktop-rag-app\\release\\win-unpacked\\resources\\md-rag-ollama-local\\.merged_knowledge\\0_2c7382f4d2_flow.md",
      "D:\\code\\desktop-rag-app\\release\\win-unpacked\\resources\\md-rag-ollama-local\\.merged_knowledge\\0_58a408474b_model.md"
    ],
    "scores": [
      0.2912023460410557,
      0.22764530551415796,
      0.13203463203463203
    ],
    "retrieval": {
      "strategy": "hybrid",
      "reranker": "token_overlap",
      "embed_timeout_sec": 60,
      "chat_timeout_sec": 180,
      "context_chars": 618,
      "context_truncated": false,
      "knowledge_hit": true,
      "fallback_mode": "rag"
    },
    "sourceDetails": [
      {
        "source": "D:\\code\\desktop-rag-app\\release\\win-unpacked\\resources\\md-rag-ollama-local\\.merged_knowledge\\0_582e9bb37a_data_ops.md",
        "score": 0.2912023460410557,
        "snippet": "# 数据加卸载说明\n\n数据加卸载能力：\n- 可添加多个知识目录\n- 可按目录移除\n- 每次变更后建议重建索引"
      },
      {
        "source": "D:\\code\\desktop-rag-app\\release\\win-unpacked\\resources\\md-rag-ollama-local\\.merged_knowledge\\0_2c7382f4d2_flow.md",
        "score": 0.22764530551415796,
        "snippet": "# 本地RAG桌面流程\n\n桌面端标准流程：\n1. 健康检查（doctor）\n2. 配置知识目录\n3. 重建索引（index）\n4. 发起查询（ask）"
      },
      {
        "source": "D:\\code\\desktop-rag-app\\release\\win-unpacked\\resources\\md-rag-ollama-local\\.merged_knowledge\\0_58a408474b_model.md",
        "score": 0.13203463203463203,
        "snippet": "# 模型连接说明\n\n默认本地模型：llama3.1:8b\nOllama 地址：http://127.0.0.1:11434"
      }
    ]
  }
}
```

