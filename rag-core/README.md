# Markdown RAG + Local Ollama (8B)

Local-first RAG workflow using Markdown files as knowledge base.

## Features
- Markdown ingestion and chunking
- SQLite or Qdrant vector index
- Knowledge-base isolation via `kb_id`
- Ollama embedding + generation integration
- CLI for indexing, querying, health checks
- Automated tests and regression report

## Quick Start
1. Install Python deps
   - `python -m pip install -r requirements.txt`
2. Ensure Ollama is running and model is available
   - `ollama list`
   - Confirm `llama3.1:8b` exists
3. Set module path in PowerShell session
   - `$env:PYTHONPATH = "$PWD\\src"`
4. Build index
   - `python -m mdrag.cli index --knowledge-dir .\\knowledge --db .\\index.db --embedding-model llama3.1:8b --chat-model llama3.1:8b --clear-first`
5. Ask question
   - `python -m mdrag.cli ask --db .\\index.db --question "How do I deploy locally?" --embedding-model llama3.1:8b --chat-model llama3.1:8b`
   - 推荐（混合检索 + 重排）：
     - `python -m mdrag.cli ask --db .\\index.db --question "How do I deploy locally?" --retrieval-strategy hybrid --reranker token_overlap --embedding-model llama3.1:8b --chat-model llama3.1:8b`

## CLI
- `index`: create/update embeddings index from markdown
- `ask`: retrieve + generate answer
- `doctor`: check Ollama connectivity and models
- `rebuild`: delete and rebuild index

## Configuration defaults
- Ollama URL: `http://127.0.0.1:11434`
- Embedding model: `llama3.1:8b`
- Chat model: `llama3.1:8b`
- Chunk size: `600`
- Chunk overlap: `120`
- Top-k retrieval: `4`
- Retrieval strategy: `hybrid` (`hybrid|dense|sparse`)
- Reranker: `token_overlap` (`token_overlap|llm_score|none`)
- Rerank top-n: `8`
- Max context chars: `5000`

## Retrieval and reranking options
- `--retrieval-strategy hybrid|dense|sparse`
- `--dense-candidate-multiplier 3`
- `--rrf-k 60`
- `--min-retrieval-score 0.0`
- `--max-context-chars 5000`
- `--bm25-k1 1.5`
- `--bm25-b 0.75`
- `--reranker token_overlap|llm_score|none`
- `--rerank-top-n 8`
- `--embed-timeout-sec 60`  # 向量化阶段超时（秒）
- `--chat-timeout-sec 180`  # 生成阶段超时（秒）

## Vector backend options
- `--vector-backend sqlite|qdrant`
- `--kb-id default`  # 每个知识库独立索引空间
- `--qdrant-url http://127.0.0.1:6333`
- `--qdrant-api-key ""`
- `--qdrant-collection mdrag_chunks`

Example (`qdrant`):
- `python -m mdrag.cli index --knowledge-dir .\\knowledge --vector-backend qdrant --qdrant-url http://127.0.0.1:6333 --qdrant-collection mdrag_chunks --kb-id kb-demo --embedding-model llama3.1:8b --chat-model llama3.1:8b --clear-first`

## Evaluation
- Sample eval set: `docs/eval_set_sample.jsonl`
- Run:
  - `python .\\scripts\\eval_rag.py --db .\\index.db --retrieval-strategy hybrid --reranker token_overlap`
- Output:
  - Markdown report: `docs/eval_report_latest.md`
  - JSON report: `docs/eval_report_latest.json`

## Testing
- `pytest -q`
- `powershell -ExecutionPolicy Bypass -File .\\scripts\\run_regression.ps1`
