# Phase 1/2/3 Execution Report (2026-02-17)

## 1) Run and usability check
- App startup check: `npm run start` reached running state (`START_CHECK=RUNNING_OK`), no startup crash.
- Smoke (sqlite): passed.
  - report: `docs/smoke_report_sqlite.md`
  - report: `docs/smoke_report_sqlite_after_ui.md`
- Smoke (qdrant): failed due local environment blockers, not code crash.
  - report: `docs/smoke_report_qdrant.md`
  - blocker A: `qdrant-client` missing in local Python runtime
  - blocker B: local Qdrant endpoint unreachable (`ECONNREFUSED 127.0.0.1:6333`)

## 2) Packaging
- Command: `npm run dist:win`
- Result: success (NSIS + portable)
- Artifacts:
  - `release/本地知识库助手 Setup 0.1.0.exe`
  - `release/本地知识库助手 0.1.0.exe`
  - `release/本地知识库助手 Setup 0.1.0.exe.blockmap`

## 3) UI table upgrade for KB history
- Added searchable/sortable KB history table in KB settings.
- Added row-select interaction to sync dropdown selection.
- Added columns: name/id/docCount/indexStatus/lastIndexedAt/lastUsedAt.
- Added controls:
  - search input
  - sort key
  - sort direction

## Regression after changes
- `npm test -- --run`: pass
- `npm run build`: pass
- `npm run smoke -- --vector-backend sqlite ...`: pass
