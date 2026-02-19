param(
  [string]$AssetRoot = "$PSScriptRoot\..\offline-assets",
  [string]$InstallPython = "true",
  [string]$InstallDocker = "true",
  [string]$InstallOllama = "true",
  [string]$StartQdrant = "true",
  [string]$PullModel = "false",
  [string]$ModelName = "llama3.1:8b",
  [string]$QdrantContainer = "qdrant-local",
  [string]$QdrantImage = "qdrant/qdrant:latest",
  [string]$QdrantStorage = "$env:USERPROFILE\qdrant_storage"
)

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"
$PSNativeCommandUseErrorActionPreference = $false

function To-Bool($value, $default = $true) {
  if ($null -eq $value) { return $default }
  $t = "$value".Trim().ToLowerInvariant()
  if ($t -in @("1", "true", "yes", "y", "on")) { return $true }
  if ($t -in @("0", "false", "no", "n", "off")) { return $false }
  return $default
}

function Write-Step($name, $ok, $detail) {
  [ordered]@{
    step = $name
    ok = $ok
    detail = $detail
    time = (Get-Date).ToString("s")
  } | ConvertTo-Json -Compress
}

function Has-Cmd($name) {
  return $null -ne (Get-Command $name -ErrorAction SilentlyContinue)
}

function Install-FromFile($name, $exePath, $args, $enabled) {
  if (Has-Cmd $name) {
    Write-Output (Write-Step "$name.check" $true "already installed")
    return
  }
  if (-not $enabled) {
    Write-Output (Write-Step "$name.check" $false "not installed and disabled")
    return
  }
  if (-not (Test-Path $exePath)) {
    throw "$name installer not found: $exePath"
  }
  Write-Output (Write-Step "$name.install" $true "offline install from $exePath")
  $p = Start-Process -FilePath $exePath -ArgumentList $args -Wait -PassThru
  if ($p.ExitCode -ne 0) {
    throw "$name install failed, exitCode=$($p.ExitCode)"
  }
  Write-Output (Write-Step "$name.install" $true "installed")
}

function Wait-DockerReady {
  for ($i = 0; $i -lt 50; $i++) {
    docker info 1>$null 2>$null
    if ($LASTEXITCODE -eq 0) { return $true }
    Start-Sleep -Seconds 3
  }
  return $false
}

try {
  $doInstallPython = To-Bool $InstallPython $true
  $doInstallDocker = To-Bool $InstallDocker $true
  $doInstallOllama = To-Bool $InstallOllama $true
  $doStartQdrant = To-Bool $StartQdrant $true
  $doPullModel = To-Bool $PullModel $false

  $root = (Resolve-Path $AssetRoot).Path
  $pythonInstaller = Join-Path $root "python\python-installer.exe"
  $dockerInstaller = Join-Path $root "docker\DockerDesktopInstaller.exe"
  $ollamaInstaller = Join-Path $root "ollama\OllamaSetup.exe"
  $qdrantTar = Join-Path $root "qdrant\qdrant-image.tar"

  Install-FromFile -name "python" -exePath $pythonInstaller -args "/quiet InstallAllUsers=0 PrependPath=1 Include_test=0" -enabled:$doInstallPython
  Install-FromFile -name "docker" -exePath $dockerInstaller -args "install --quiet" -enabled:$doInstallDocker
  Install-FromFile -name "ollama" -exePath $ollamaInstaller -args "/S" -enabled:$doInstallOllama

  if ($doStartQdrant) {
    if (-not (Has-Cmd "docker")) {
      throw "docker not available, cannot start qdrant"
    }
    docker info 1>$null 2>$null
    if ($LASTEXITCODE -ne 0) {
      $dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
      if (Test-Path $dockerDesktop) {
        Start-Process -FilePath $dockerDesktop | Out-Null
      }
      if (-not (Wait-DockerReady)) {
        throw "docker engine not ready"
      }
    }
    if (-not (Test-Path $qdrantTar)) {
      throw "qdrant image tar not found: $qdrantTar"
    }
    docker load -i $qdrantTar 1>$null 2>$null
    if ($LASTEXITCODE -ne 0) {
      throw "qdrant image load failed"
    }
    if (-not (Test-Path $QdrantStorage)) {
      New-Item -ItemType Directory -Path $QdrantStorage -Force | Out-Null
    }
    docker rm -f $QdrantContainer 1>$null 2>$null
    $qdrantVolume = "$($QdrantStorage):/qdrant/storage"
    docker run -d --name $QdrantContainer -p 6333:6333 -p 6334:6334 -v $qdrantVolume $QdrantImage 1>$null 2>$null
    if ($LASTEXITCODE -ne 0) {
      throw "qdrant container start failed"
    }
    Write-Output (Write-Step "qdrant.run" $true "container=$QdrantContainer")
  }

  if ($doPullModel) {
    Write-Output (Write-Step "ollama.import" $true "skip in offline package; user can add model later")
  }

  Write-Output (Write-Step "runtime.offline.setup" $true "completed")
  exit 0
}
catch {
  Write-Output (Write-Step "runtime.offline.setup" $false $_.Exception.Message)
  exit 2
}
