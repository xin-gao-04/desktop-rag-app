# Qdrant + Knowledge Registry Plan (2026-02-17)

## Technical selection
- Vector backend: `Qdrant` (local/self-hosted, REST + SDK, collection isolation).
- Fallback backend: `SQLite` (single-file local index).
- Knowledge-base scope: use stable `kb_id` (registry record id) instead of name for indexing/query isolation.
- App architecture:
  - Electron main: config + IPC + runner orchestration.
  - `md-rag-ollama-local`: retrieval/index/query core.
  - Vue UI: complete configuration and KB CRUD/selection workflows.

## Implemented in this round
- `md-rag`:
  - Added `--vector-backend`, `--qdrant-*`, `--kb-id`.
  - Added `QdrantStore`.
  - Added `kb_id` isolation for build/query/retrieval.
- Desktop app:
  - Config now supports `vectorBackend`, `qdrantUrl`, `qdrantApiKey`, `qdrantCollection`.
  - Runner forwards vector args to CLI for `index/ask/ask-stream`.
  - Added knowledge registry metadata (`id/name/path/docCount/indexStatus/lastIndexedAt/lastUsedAt`).
  - KB panel supports metadata display + rename + select/delete.
  - Index feedback now shows vector backend and `kb_id`.

## Next stage
- UI table view for full KB history CRUD (sort/filter/search).
- Qdrant collection diagnostics and collection-level cleanup UI.
- Optional pgvector adapter (same `kb_id` contract).
- End-to-end packaging regression with bundled `qdrant-client`.
