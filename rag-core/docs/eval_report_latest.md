# RAG Eval Report (2026-02-16T14:17:00)

## Run Config
- dataset: `D:\code\md-rag-ollama-local\docs\eval_set_sample.jsonl`
- db: `D:\code\md-rag-ollama-local\index.db`
- retrieval_strategy: `hybrid`
- reranker: `token_overlap`
- top_k: `4`
- max_context_chars: `5000`

## Summary
- cases: `3`
- hit@k: `1.0000`
- mrr: `0.4167`
- source_coverage: `1.0000`
- answer_keyword_recall: `1.0000`

## Per Case
### 1. 本地RAG构建流程是什么？
- expected_sources: `['local_deploy.md', 'README.md']`
- retrieved: `['0_1_README.md', 'README.md', '0_0_local_deploy.md', 'local_deploy.md']`
- hit@k: `True`
- mrr: `0.5000`
- source_coverage: `1.0000`
- answer_keyword_recall: `1.0000`

### 2. 如果doctor失败应该怎么处理？
- expected_sources: `['README.md']`
- retrieved: `['0_0_local_deploy.md', 'local_deploy.md', '0_1_README.md', 'README.md']`
- hit@k: `True`
- mrr: `0.2500`
- source_coverage: `1.0000`
- answer_keyword_recall: `1.0000`

### 3. 知识库如何加载和更新？
- expected_sources: `['README.md']`
- retrieved: `['0_1_README.md', 'README.md', '0_0_local_deploy.md', 'local_deploy.md']`
- hit@k: `True`
- mrr: `0.5000`
- source_coverage: `1.0000`
- answer_keyword_recall: `1.0000`
