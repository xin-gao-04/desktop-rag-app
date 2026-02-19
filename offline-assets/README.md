# Offline Assets Layout

Put offline installers and artifacts in this folder before building an offline bundle.

Required files:

- `python/python-installer.exe`
- `docker/DockerDesktopInstaller.exe`
- `ollama/OllamaSetup.exe`
- `qdrant/qdrant-image.tar`  (from `docker save qdrant/qdrant:latest -o qdrant-image.tar`)

Optional files:
- Model export tar if you want offline model import (not required by default).

Bundle builder command:

- `npm run bundle:offline`

Runtime offline setup script:

- `installer/windows/setup-offline-runtime.ps1`
