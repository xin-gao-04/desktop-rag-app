# Local Deployment Runbook

## Prerequisites
- Python 3.9+
- Ollama running locally
- `llama3.1:8b` available in local models

## Steps
1. Confirm model list:
   - `ollama list`
2. Set module path:
   - `$env:PYTHONPATH = "$PWD\\src"`
3. Index docs:
   - `python -m mdrag.cli index --knowledge-dir .\\knowledge --db .\\index.db --embedding-model llama3.1:8b --chat-model llama3.1:8b --clear-first`
4. Ask:
   - `python -m mdrag.cli ask --db .\\index.db --question "What is the local flow?" --embedding-model llama3.1:8b --chat-model llama3.1:8b`

## Troubleshooting
- If doctor fails, run: `python -m mdrag.cli doctor`
- If no chunks found, ensure `.md` files exist under `knowledge/`
