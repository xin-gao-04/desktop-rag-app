# Architecture

- Renderer: Vue 3 UI for config, source management, indexing, and querying.
- Preload: secure API bridge (`window.desktopRag`).
- Main process: IPC handlers + filesystem + Python CLI orchestration.
- RAG backend: bundled `rag-core` CLI.

## Runtime Flow
1. Load config from AppData.
2. Manage source directories in UI.
3. Merge markdown from all sources into a temporary merged knowledge folder.
4. Run `python -m mdrag.cli index` over merged folder.
5. Run `python -m mdrag.cli ask` for user query.
6. Show answer + source details.
