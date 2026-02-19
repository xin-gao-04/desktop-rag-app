@echo off
setlocal
chcp 65001 >nul

set ROOT=%~dp0
if not exist "%ROOT%install-offline-all.ps1" (
  echo [ERROR] 未找到 install-offline-all.ps1
  pause
  exit /b 2
)

echo [INFO] 开始一键离线安装（应用+运行时+自动启动）...
powershell -ExecutionPolicy Bypass -File "%ROOT%install-offline-all.ps1" -BundleRoot "%ROOT%"
if errorlevel 1 (
  echo [ERROR] 一键离线安装失败，exit=%errorlevel%
  pause
  exit /b 3
)

echo [OK] 一键离线安装完成。
pause
exit /b 0
