# Workflow Document

## End-to-end flow
1. Ensure Ollama is running and local 8B model is available (tested with `llama3.1:8b`).
2. Put markdown files under `knowledge/`.
3. Build vector index from markdown.
4. Ask question using retrieved context.
5. Re-run regression tests after any logic changes.

## PowerShell commands (recommended)
Set module path for current shell:
- `$env:PYTHONPATH = "$PWD\\src"`

Health check:
- `python -m mdrag.cli doctor --ollama-url http://127.0.0.1:11434`

Index:
- `python -m mdrag.cli index --knowledge-dir .\\knowledge --db .\\index.db --embedding-model llama3.1:8b --chat-model llama3.1:8b --clear-first`

Ask:
- `python -m mdrag.cli ask --db .\\index.db --question "本地RAG知识库的执行流程是什么？" --embedding-model llama3.1:8b --chat-model llama3.1:8b`

Regression:
- `powershell -ExecutionPolicy Bypass -File .\\scripts\\run_regression.ps1`

## Functional modules
- `loader.py`: markdown discovery and read
- `chunking.py`: chunk with overlap
- `vector_store.py`: sqlite persistence
- `pipeline.py`: index + retrieve + prompt + generate
- `ollama_client.py`: local HTTP API calls
- `cli.py`: command entrypoint
