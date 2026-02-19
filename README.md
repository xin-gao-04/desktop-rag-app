# Desktop RAG App

Electron + Vue desktop client for local Markdown RAG.

## Features
- AppData-based configuration
- Knowledge source add/remove
- Rebuild index over merged markdown corpus
- Ask with local Ollama and show source details
- Multi-theme UI (GitHub/Atlassian/Azure/Notion/IBM styles)

## Run
1. `npm install --ignore-scripts`
2. `npm run dev`
3. 生产启动：`npm run start`

If Electron binary download fails in your network environment, set mirror and rebuild:
- PowerShell: `$env:ELECTRON_MIRROR='https://npmmirror.com/mirrors/electron/'`
- then run: `npm rebuild electron`

## Test
- `npm test`
- `npm run smoke`
  - 端到端冒烟：`doctor -> index -> ask`
  - 报告输出：`docs/smoke_report.md`
  - 自定义示例：
    - `node scripts/smoke_rag.cjs --kb .\\demo-kb --question "总结流程" --report .\\docs\\smoke_custom.md`
    - `node scripts/smoke_rag.cjs --chunk-size 600 --chunk-overlap 120 --embed-timeout-sec 60 --chat-timeout-sec 240`

## Build Installer (Windows)
- `npm run dist:win`
- `npm run dist:win:minenv`（同上，包含最小环境部署脚本）
- `npm run bundle:offline`（生成离线交付包）
- 产物目录：`release/`
  - `本地知识库助手 Setup *.exe`（安装版）
  - `本地知识库助手 *.exe`（便携版）

打包说明：
- 安装包已内置一体化 RAG 核心代码（位于应用 `resources/rag-core`）
- 安装包已内置最小环境部署脚本：`resources/installer/windows/setup-min-runtime.ps1`
- 安装包已内置离线部署脚本：`resources/installer/windows/setup-offline-runtime.ps1`
- UI 可在“配置设置 -> 最小环境部署”中一键安装并启动：
  - Python
  - Docker Desktop
  - Ollama
  - Qdrant 容器
- 默认不拉取/不导入模型；可在部署区勾选“可选：联网拉取模型/导入离线模型”
- 默认向量后端为 `qdrant`（`http://127.0.0.1:6333`）
- 索引库和知识库默认写入用户目录（`app.getPath('userData')`）

## Fully Offline Delivery
1. 准备离线资源目录 `offline-assets/`（见 `offline-assets/README.md`）。
2. 先执行资源校验：`npm run verify:offline-assets`
   - 校验报告：`docs/offline_assets_check_latest.json`
3. 执行：`npm run bundle:offline`
4. 输出目录：`release/offline-bundle/<timestamp>/`
5. 在目标机器运行：
   - 推荐：双击一键脚本 `install-offline-all.cmd`（自动安装应用+部署离线环境+尝试启动应用）
   - 或分步执行：
   - 安装应用：`本地知识库助手 Setup 0.1.0.exe`
   - 运行：`setup-offline-runtime.ps1 ...`
   - 部署离线最小环境：
     - `setup-offline-runtime.ps1 -AssetRoot .\offline-assets -InstallPython true -InstallDocker true -InstallOllama true -StartQdrant true -PullModel false`

## Dependencies
- Local Python + bundled `rag-core`
- Local Ollama endpoint (model managed by user)
