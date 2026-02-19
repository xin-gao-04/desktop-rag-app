# Offline Bundle Delivery Report (2026-02-17)

## Assets prepared
- `offline-assets/python/python-installer.exe`
- `offline-assets/docker/DockerDesktopInstaller.exe`
- `offline-assets/ollama/OllamaSetup.exe`
- `offline-assets/qdrant/qdrant-image.tar`
- `offline-assets/models/ollama-model-llama3.1-8b.tar`

## Verification
- `npm run verify:offline-assets` => PASS
- Report: `docs/offline_assets_check_latest.json`

## Offline bundle generated
- Path: `release/offline-bundle/20260217-224648`
- Includes:
  - `本地知识库助手 Setup 0.1.0.exe`
  - `本地知识库助手 0.1.0.exe`
  - `setup-offline-runtime.ps1`
  - `setup-min-runtime.ps1`
  - `install-offline-all.cmd`
  - `offline-assets/` (all required artifacts)
  - `offline-bundle-manifest.json` (SHA256 + size)

## Simulated clean-flow validation
- Ran offline setup from bundle path:
  - `setup-offline-runtime.ps1 -AssetRoot <bundle>\\offline-assets -InstallPython false -InstallDocker false -InstallOllama false -StartQdrant true -PullModel true -ModelName llama3.1:8b`
  - Result: PASS
- Ran packaged-workdir smoke on qdrant:
  - Report: `docs/smoke_report_offline_bundle_simulated_clean.md`
  - Result: PASS (`indexedChunks=3`, `sourceCount=3`)
