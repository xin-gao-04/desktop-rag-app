# Smoke Report

- time: 2026-02-16T07:30:48.651Z
- pass: true
- reason: ok
- knowledge: D:\code\desktop-rag-app\demo-kb
- question: 请用三条要点总结本地RAG流程。

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
  "retrievalConfig": {
    "topK": 4,
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
    "question": "请用三条要点总结本地RAG流程。",
    "answer": "Based on the provided context, here are three key points summarizing the local RAG (Relational Argumentation Graph) process:\n\n• **健康检查（doctor）**: The process starts with a health check to ensure the system is functioning properly.\n• **配置知识目录和重建索引（index）**: Next, configure the knowledge directory and rebuild the index to prepare for querying.\n• **发起查询（ask）**: Finally, initiate a query using the configured model (default: llama3.1:8b) and Ollama address.\n\nNote that the context only provides three source files ([0_2c7382f4d2_flow.md], [0_58a408474b_model.md], and [0_582e9bb37a_data_ops.md]) which are not enough to cover all aspects of the local RAG process. If more information is required, please let me know!",
    "sources": [
      "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_2c7382f4d2_flow.md",
      "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_58a408474b_model.md",
      "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_582e9bb37a_data_ops.md"
    ],
    "scores": [
      0.27414880201765446,
      0.11253101736972705,
      0.0047619047619047615
    ],
    "retrieval": {
      "strategy": "hybrid",
      "reranker": "token_overlap",
      "context_chars": 477,
      "context_truncated": false
    },
    "sourceDetails": [
      {
        "source": "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_2c7382f4d2_flow.md",
        "score": 0.27414880201765446,
        "snippet": "# 本地RAG桌面流程\n\n桌面端标准流程：\n1. 健康检查（doctor）\n2. 配置知识目录\n3. 重建索引（index）\n4. 发起查询（ask）\r\n"
      },
      {
        "source": "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_58a408474b_model.md",
        "score": 0.11253101736972705,
        "snippet": "# 模型连接说明\n\n默认本地模型：llama3.1:8b\nOllama 地址：http://127.0.0.1:11434\r\n"
      },
      {
        "source": "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_582e9bb37a_data_ops.md",
        "score": 0.0047619047619047615,
        "snippet": "# 数据加卸载说明\n\n数据加卸载能力：\n- 可添加多个知识目录\n- 可按目录移除\n- 每次变更后建议重建索引\r\n"
      }
    ]
  }
}
```

