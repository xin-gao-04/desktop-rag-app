# Workflow

This project is executed under `D:\code\agent-harness` task orchestration (`desktop-rag-001`).
Qdrant + knowledge-registry extension is tracked under `desktop-rag-qdrant-001`.

## Harness commands used
- init-task
- run-step (M1..M5)
- checkpoint after each milestone
- replay/resume for continuity

## Dev + Validation
- `npm test`
- `npm run build`
- `npm run smoke`
- Manual local Ollama checks through UI and command outputs.
