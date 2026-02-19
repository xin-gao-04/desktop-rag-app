param(
  [string]$BundleRoot = "",
  [string]$AssetRoot = "",
  [switch]$SkipAppInstall = $false,
  [switch]$SkipRuntimeSetup = $false,
  [switch]$SkipLaunchApp = $false
)

$ErrorActionPreference = "Stop"

function Write-Step($name, $ok, $detail) {
  [ordered]@{
    step = $name
    ok = $ok
    detail = $detail
    time = (Get-Date).ToString("s")
  } | ConvertTo-Json -Compress
}

function Resolve-BundleRoot($explicitRoot) {
  if ($explicitRoot -and (Test-Path $explicitRoot)) {
    return (Resolve-Path $explicitRoot).Path
  }
  return (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
}

function Find-SetupExe($root) {
  return Get-ChildItem -Path $root -Filter "*Setup 0.1.0.exe" -File -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
}

function Find-AppExe($root) {
  $candidates = @(
    (Join-Path $env:LOCALAPPDATA "Programs\本地知识库助手\本地知识库助手.exe"),
    (Join-Path $env:ProgramFiles "本地知识库助手\本地知识库助手.exe"),
    (Join-Path $root "本地知识库助手 0.1.0.exe")
  )
  foreach ($p in $candidates) {
    if (Test-Path $p) { return (Resolve-Path $p).Path }
  }
  return ""
}

try {
  $root = Resolve-BundleRoot $BundleRoot
  if (-not $AssetRoot) {
    $AssetRoot = Join-Path $root "offline-assets"
  }
  if (-not (Test-Path $AssetRoot)) {
    throw "offline assets not found: $AssetRoot"
  }

  if (-not $SkipAppInstall) {
    $setupExe = Find-SetupExe $root
    if (-not $setupExe) {
      throw "setup exe not found: *Setup 0.1.0.exe"
    }
    Write-Output (Write-Step "app.install" $true ("start installer: " + $setupExe.FullName))
    $p = Start-Process -FilePath $setupExe.FullName -Wait -PassThru
    if ($p.ExitCode -ne 0) {
      throw ("app install failed, exitCode=" + $p.ExitCode)
    }
    Write-Output (Write-Step "app.install" $true "completed")
  } else {
    Write-Output (Write-Step "app.install" $true "skipped")
  }

  if (-not $SkipRuntimeSetup) {
    $runtimeScript = Join-Path $root "setup-offline-runtime.ps1"
    if (-not (Test-Path $runtimeScript)) {
      throw "setup-offline-runtime.ps1 not found"
    }
    Write-Output (Write-Step "runtime.setup" $true "start offline runtime setup")
    $args = @(
      "-ExecutionPolicy", "Bypass",
      "-File", $runtimeScript,
      "-AssetRoot", $AssetRoot,
      "-InstallPython", "true",
      "-InstallDocker", "true",
      "-InstallOllama", "true",
      "-StartQdrant", "true",
      "-PullModel", "false",
      "-ModelName", "llama3.1:8b"
    )
    $rp = Start-Process -FilePath "powershell" -ArgumentList $args -Wait -PassThru
    if ($rp.ExitCode -ne 0) {
      throw ("runtime setup failed, exitCode=" + $rp.ExitCode)
    }
    Write-Output (Write-Step "runtime.setup" $true "completed")
  } else {
    Write-Output (Write-Step "runtime.setup" $true "skipped")
  }

  if (-not $SkipLaunchApp) {
    $appExe = Find-AppExe $root
    if ($appExe) {
      Start-Process -FilePath $appExe | Out-Null
      Write-Output (Write-Step "app.launch" $true ("started: " + $appExe))
    } else {
      Write-Output (Write-Step "app.launch" $false "app exe not found, start manually")
    }
  } else {
    Write-Output (Write-Step "app.launch" $true "skipped")
  }

  Write-Output (Write-Step "offline.install.all" $true "completed")
  exit 0
}
catch {
  Write-Output (Write-Step "offline.install.all" $false $_.Exception.Message)
  exit 2
}
