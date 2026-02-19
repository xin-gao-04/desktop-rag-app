# Stage-2 RAG Optimization Summary (2026-02-16)

## Implemented in this round

- Hybrid retrieval (`dense + sparse BM25`) with RRF fusion.
- Optional reranker stage:
  - `none`
  - `token_overlap`
  - `llm_score` (uses local Ollama model for relevance scoring)
- Context budget control (`max_context_chars`) and truncation metadata.
- Tunable retrieval knobs exposed through CLI.
- Reusable evaluation script and sample evaluation dataset.

## New CLI knobs

- `--retrieval-strategy hybrid|dense|sparse`
- `--dense-candidate-multiplier`
- `--rrf-k`
- `--min-retrieval-score`
- `--max-context-chars`
- `--bm25-k1`
- `--bm25-b`
- `--reranker token_overlap|llm_score|none`
- `--rerank-top-n`

## Evaluation tooling

- Script: `scripts/eval_rag.py`
- Sample set: `docs/eval_set_sample.jsonl`
- Output:
  - `docs/eval_report_latest.md` / `.json`
  - `docs/eval_report_none.md` / `.json`
  - `docs/eval_report_llm_score.md` / `.json`

## Baseline comparison (local run)

- Dataset cases: `3`

| Strategy | hit@k | MRR | answer_keyword_recall |
|---|---:|---:|---:|
| hybrid + `none` | 1.0000 | 0.4167 | 0.8889 |
| hybrid + `token_overlap` | 1.0000 | 0.4167 | 1.0000 |
| hybrid + `llm_score` | 1.0000 | 0.5833 | 0.8889 |

Interpretation:
- On this small dataset, `llm_score` improved ranking quality (`MRR`) the most.
- `token_overlap` improved answer keyword coverage in this run.
- Recommended default for latency/cost balance: `token_overlap`.
- Recommended high-accuracy mode: `llm_score` with lower `rerank_top_n` (e.g., `4~8`).

## Suggested production defaults

- `retrieval_strategy=hybrid`
- `reranker=token_overlap`
- `top_k=4`
- `dense_candidate_multiplier=3`
- `rrf_k=60`
- `max_context_chars=5000`

## Industry references (GitHub / official docs)

- LlamaIndex hybrid retrieval examples:
  - https://docs.llamaindex.ai/en/stable/examples/vector_stores/simpleindexdemo-hybrid/
- Haystack hybrid retrieval tutorial:
  - https://haystack.deepset.ai/tutorials/33_hybrid_retrieval/
- GraphRAG (Microsoft):
  - https://github.com/microsoft/graphrag
- Ragas evaluation framework:
  - https://docs.ragas.io/
- LangChain retriever integrations:
  - https://python.langchain.com/docs/integrations/retrievers/
