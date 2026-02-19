# RAG Review & Optimization Notes (2026-02-16)

## 1) Code Review Findings (before optimization)

- High: retrieval was dense-only cosine scan over all chunks; lexical miss/alias miss risk is high on keyword-heavy queries.
  - `src/mdrag/pipeline.py` (previous `Retriever.search` only cosine ranking)
- High: no rank fusion / rerank stage, so retrieval robustness depended on single signal.
- Medium: context assembly had no hard budget control, increasing prompt overflow/noise risk for long chunks.
- Medium: retrieval score thresholding and fallback policy were missing, reducing quality control knobs.
- Medium: retrieval metadata was minimal, making runtime diagnostics and evaluation harder.

## 2) Industry Patterns Observed (GitHub / official docs)

- Hybrid retrieval (dense + sparse) and fusion are mainstream defaults in production RAG stacks.
  - LlamaIndex Hybrid Search docs: https://docs.llamaindex.ai/en/stable/examples/vector_stores/simpleindexdemo-hybrid/
  - Haystack hybrid retrieval tutorial: https://haystack.deepset.ai/tutorials/33_hybrid_retrieval/
- Reciprocal Rank Fusion (RRF) is a practical late-fusion method used broadly for robust ranking.
  - Haystack release notes (RRF support): https://github.com/deepset-ai/haystack/releases
- Multi-stage retrieval and graph-augmented retrieval are key frontier directions for long/complex corpora.
  - Microsoft GraphRAG repo: https://github.com/microsoft/graphrag
- Query diversification / multi-query retrieval is a common approach to improve recall.
  - LangChain retriever docs (MultiQueryRetriever): https://python.langchain.com/docs/integrations/retrievers/

## 3) Implemented Optimizations in this round

### 3.1 Hybrid retrieval with RRF fusion

- Added sparse BM25-style retrieval path and dense+sparse fusion.
- Added configurable strategy: `hybrid | dense | sparse`.
- Implemented RRF scoring (`rrf_k`) and candidate multiplier (`dense_candidate_multiplier`).

Files:
- `D:\code\md-rag-ollama-local\src\mdrag\pipeline.py`
- `D:\code\md-rag-ollama-local\src\mdrag\config.py`
- `D:\code\md-rag-ollama-local\src\mdrag\cli.py`

### 3.2 Retrieval quality controls

- Added `min_retrieval_score` threshold with safe backfill (avoid over-filtering collapse).
- Kept source-level dedup to reduce duplicate merged-doc hits.

Files:
- `D:\code\md-rag-ollama-local\src\mdrag\pipeline.py`

### 3.3 Context budget control + retrieval metadata

- Added context char budget (`max_context_chars`) and truncation marker.
- Added retrieval metadata in ask output:
  - strategy
  - context_chars
  - context_truncated

Files:
- `D:\code\md-rag-ollama-local\src\mdrag\pipeline.py`

### 3.4 Prompt hardening

- Prompt now asks for inline source filename citation when possible.

File:
- `D:\code\md-rag-ollama-local\src\mdrag\pipeline.py`

## 4) New CLI knobs

- `--retrieval-strategy hybrid|dense|sparse`
- `--dense-candidate-multiplier 3`
- `--rrf-k 60`
- `--min-retrieval-score 0.0`
- `--max-context-chars 5000`
- `--bm25-k1 1.5`
- `--bm25-b 0.75`

Example:

```powershell
python -m mdrag.cli ask \
  --db index.db \
  --question "总结本地RAG流程" \
  --retrieval-strategy hybrid \
  --rrf-k 60 \
  --max-context-chars 5000
```

## 5) Validation

- Python tests: `8 passed`
  - command: `pytest -q` (with `PYTHONPATH=src`)
- Desktop app tests: `3 passed`
  - command: `npm run test`

## 6) Recommended next backlog (high ROI)

- Add optional reranker stage (cross-encoder / local rerank model) after hybrid recall.
- Add retrieval/e2e eval set with metrics (Hit@k, MRR, answer faithfulness).
- Add ingestion metadata (title, section, tags, modified time) and metadata-aware filtering.
- Add chunking upgrade (semantic/sentence-aware splitter) for better context cohesion.
