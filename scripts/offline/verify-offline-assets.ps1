param(
  [string]$AssetRoot = ".\offline-assets",
  [string]$ReportPath = ""
)

$ErrorActionPreference = "Stop"

function New-ItemResult($path, $required, $exists, $size = 0, $hint = "") {
  [ordered]@{
    path = $path
    required = $required
    exists = $exists
    size = $size
    hint = $hint
  }
}

$root = Resolve-Path $AssetRoot -ErrorAction SilentlyContinue
if (-not $root) {
  Write-Output "OFFLINE_ASSET_CHECK=FAIL"
  Write-Output "ASSET_ROOT_NOT_FOUND=$AssetRoot"
  exit 2
}
$assetAbs = $root.Path

$spec = @(
  @{ path = "python\python-installer.exe"; required = $true;  hint = "Python Windows offline installer" },
  @{ path = "docker\DockerDesktopInstaller.exe"; required = $true; hint = "Docker Desktop installer" },
  @{ path = "ollama\OllamaSetup.exe"; required = $true; hint = "Ollama installer" },
  @{ path = "qdrant\qdrant-image.tar"; required = $true; hint = "docker save qdrant/qdrant:latest output" }
)

$items = @()
$missingRequired = @()

foreach ($s in $spec) {
  $full = Join-Path $assetAbs $s.path
  $exists = Test-Path $full
  $size = 0
  if ($exists) {
    $size = (Get-Item $full).Length
  }
  $item = New-ItemResult -path $s.path -required $s.required -exists $exists -size $size -hint $s.hint
  $items += $item
  if ($s.required -and -not $exists) {
    $missingRequired += $s.path
  }
}

$result = [ordered]@{
  checkedAt = (Get-Date).ToString("s")
  assetRoot = $assetAbs
  ok = ($missingRequired.Count -eq 0)
  missingRequired = $missingRequired
  items = $items
}

if ($ReportPath) {
  $rp = Resolve-Path (Split-Path -Parent $ReportPath) -ErrorAction SilentlyContinue
  if (-not $rp) {
    New-Item -ItemType Directory -Path (Split-Path -Parent $ReportPath) -Force | Out-Null
  }
  $result | ConvertTo-Json -Depth 5 | Set-Content -Path $ReportPath -Encoding UTF8
}

if ($result.ok) {
  Write-Output "OFFLINE_ASSET_CHECK=OK"
  foreach ($i in $items) {
    $tag = if ($i.required) { "REQ" } else { "OPT" }
    $state = if ($i.exists) { "FOUND" } else { "MISSING" }
    Write-Output "$tag $state $($i.path) size=$($i.size)"
  }
  exit 0
}

Write-Output "OFFLINE_ASSET_CHECK=FAIL"
Write-Output ("MISSING_REQUIRED=" + ($missingRequired -join ","))
foreach ($i in $items) {
  $tag = if ($i.required) { "REQ" } else { "OPT" }
  $state = if ($i.exists) { "FOUND" } else { "MISSING" }
  Write-Output "$tag $state $($i.path) size=$($i.size)"
}
exit 2
