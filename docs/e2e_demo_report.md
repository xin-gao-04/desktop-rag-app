# E2E Demo Report

Timestamp: 2026-02-15T15:10:57.648Z

## doctor

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
  "raw": "ollama_health=True\r\nmodels=\r\n- llama3.1:8b\r\n- qwen2.5-coder:3b\r\n- qwen2.5-coder:0.5b-fastcode\r\n- qwen2.5-coder:0.5b\r\n- qwen2.5-coder:1.5b\r\n"
}
```

## addSource

```json
{
  "ok": true,
  "sourceCount": 1,
  "sources": [
    "D:\\code\\desktop-rag-app\\demo-kb"
  ]
}
```

## index

```json
{
  "ok": true,
  "indexedChunks": 3,
  "mergedFiles": 3,
  "raw": "indexed_chunks=3\r\n"
}
```

## ask

```json
{
  "ok": true,
  "result": {
    "question": "请列出桌面端本地RAG的完整执行步骤，并说明数据加卸载能力。",
    "answer": "Based on the provided context, here are the complete execution steps for desktop local RAG (Relation Aware Generator) along with its data loading and unloading capabilities:\n\n**执行步骤（Execution Steps）**\n\n1. 健康检查（Health Check）：doctor\n2. 配置知识目录（Configure Knowledge Directory）\n3. 重建索引（Rebuild Index）\n4. 发起查询（Launch Query）：ask\n\n**数据加卸载能力（Data Loading and Unloading Capabilities）**\n\n- 可添加多个知识目录（Multiple knowledge directories can be added）\n- 可按目录移除（Knowledge can be removed by directory）\n- 每次变更后建议重建索引（Index should be rebuilt after each change）\n\nNote: The default local model used is llama3.1:8b, and the Ollama address is http://127.0.0.1:11434.",
    "sources": [
      "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_1_flow.md",
      "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_0_data_ops.md",
      "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_2_model.md"
    ],
    "scores": [
      0.6545663255863992,
      0.488834117483325,
      0.3616928088501169
    ],
    "sourceDetails": [
      {
        "source": "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_1_flow.md",
        "score": 0.6545663255863992,
        "snippet": "# 本地RAG桌面流程\n\n桌面端标准流程：\n1. 健康检查（doctor）\n2. 配置知识目录\n3. 重建索引（index）\n4. 发起查询（ask）\r\n"
      },
      {
        "source": "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_0_data_ops.md",
        "score": 0.488834117483325,
        "snippet": "# 数据加卸载说明\n\n数据加卸载能力：\n- 可添加多个知识目录\n- 可按目录移除\n- 每次变更后建议重建索引\r\n"
      },
      {
        "source": "D:\\code\\md-rag-ollama-local\\.merged_knowledge\\0_2_model.md",
        "score": 0.3616928088501169,
        "snippet": "# 模型连接说明\n\n默认本地模型：llama3.1:8b\nOllama 地址：http://127.0.0.1:11434\r\n"
      }
    ]
  }
}
```

## removeSource

```json
{
  "ok": true,
  "sourceCount": 0
}
```

## Verdict

- pass: true
- indexedChunks: 3
- sourcesReturned: 3
