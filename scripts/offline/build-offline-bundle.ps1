param(
  [string]$OutputRoot = ".\release\offline-bundle",
  [string]$AssetRoot = ".\offline-assets",
  [string]$BuildInstaller = "true"
)

$ErrorActionPreference = "Stop"

function To-Bool($value, $default = $true) {
  if ($null -eq $value) { return $default }
  $t = "$value".Trim().ToLowerInvariant()
  if ($t -in @("1", "true", "yes", "y", "on")) { return $true }
  if ($t -in @("0", "false", "no", "n", "off")) { return $false }
  return $default
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $projectRoot

powershell -ExecutionPolicy Bypass -File ".\scripts\offline\verify-offline-assets.ps1" -AssetRoot $AssetRoot -ReportPath ".\docs\offline_assets_check_latest.json"
if ($LASTEXITCODE -ne 0) {
  throw "offline asset validation failed; see docs/offline_assets_check_latest.json"
}

if (To-Bool $BuildInstaller $true) {
  npm run dist:win:minenv
  if ($LASTEXITCODE -ne 0) { throw "dist:win:minenv failed" }
}

$assetAbs = Resolve-Path $AssetRoot
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outDir = Join-Path $OutputRoot $stamp
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

$setupExe = Get-ChildItem -Path ".\release" -Filter "*Setup 0.1.0.exe" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$portableExe = Get-ChildItem -Path ".\release" -Filter "* 0.1.0.exe" | Where-Object { $_.Name -notlike "*Setup*" } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $setupExe) { throw "setup exe not found in release/" }
if (-not $portableExe) { throw "portable exe not found in release/" }

Copy-Item $setupExe.FullName -Destination $outDir -Force
Copy-Item $portableExe.FullName -Destination $outDir -Force
Copy-Item ".\installer\windows\setup-offline-runtime.ps1" -Destination $outDir -Force
Copy-Item ".\installer\windows\setup-min-runtime.ps1" -Destination $outDir -Force
Copy-Item ".\installer\windows\install-offline-all.ps1" -Destination $outDir -Force
Copy-Item ".\installer\windows\install-offline-all.cmd" -Destination $outDir -Force
Copy-Item $assetAbs -Destination (Join-Path $outDir "offline-assets") -Recurse -Force

$manifest = [ordered]@{
  createdAt = (Get-Date).ToString("s")
  output = (Resolve-Path $outDir).Path
  files = @()
}

$files = Get-ChildItem -Path $outDir -Recurse -File
foreach ($f in $files) {
  $hash = (Get-FileHash -Path $f.FullName -Algorithm SHA256).Hash
  $manifest.files += [ordered]@{
    path = $f.FullName.Substring((Resolve-Path $outDir).Path.Length + 1)
    size = $f.Length
    sha256 = $hash
  }
}

$manifestPath = Join-Path $outDir "offline-bundle-manifest.json"
$manifest | ConvertTo-Json -Depth 5 | Set-Content -Path $manifestPath -Encoding UTF8

Write-Output "OFFLINE_BUNDLE_READY=$((Resolve-Path $outDir).Path)"
