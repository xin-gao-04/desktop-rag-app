param(
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
  $obj = [ordered]@{
    step = $name
    ok = $ok
    detail = $detail
    time = (Get-Date).ToString("s")
  }
  $obj | ConvertTo-Json -Compress
}

function Has-Cmd($name) {
  return $null -ne (Get-Command $name -ErrorAction SilentlyContinue)
}

function Ensure-Winget {
  if (-not (Has-Cmd "winget")) {
    throw "winget not available; install App Installer first."
  }
}

function Ensure-Install($cmdName, $wingetId, $enableInstall) {
  if (Has-Cmd $cmdName) {
    Write-Output (Write-Step "$($cmdName).check" $true "already installed")
    return
  }
  if (-not $enableInstall) {
    Write-Output (Write-Step "$($cmdName).check" $false "not installed")
    return
  }
  Ensure-Winget
  Write-Output (Write-Step "$($cmdName).install" $true "installing via winget: $wingetId")
  winget install -e --id $wingetId --accept-source-agreements --accept-package-agreements --silent
  if (-not (Has-Cmd $cmdName)) {
    throw "$cmdName unavailable after install"
  }
  Write-Output (Write-Step "$($cmdName).install" $true "installed")
}

function Wait-DockerReady {
  for ($i = 0; $i -lt 50; $i++) {
    docker info 1>$null 2>$null
    if ($LASTEXITCODE -eq 0) {
      return $true
    }
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

  Ensure-Install -cmdName "python" -wingetId "Python.Python.3.11" -enableInstall:$doInstallPython
  Ensure-Install -cmdName "ollama" -wingetId "Ollama.Ollama" -enableInstall:$doInstallOllama
  Ensure-Install -cmdName "docker" -wingetId "Docker.DockerDesktop" -enableInstall:$doInstallDocker

  if ($doStartQdrant) {
    if (-not (Has-Cmd "docker")) {
      throw "docker unavailable; cannot start qdrant"
    }

    docker info 1>$null 2>$null
    if ($LASTEXITCODE -ne 0) {
      $dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
      if (Test-Path $dockerDesktop) {
        Start-Process -FilePath $dockerDesktop | Out-Null
        Write-Output (Write-Step "docker.desktop" $true "starting docker desktop")
      }
      if (-not (Wait-DockerReady)) {
        throw "Docker engine not ready"
      }
    }

    if (-not (Test-Path $QdrantStorage)) {
      New-Item -ItemType Directory -Path $QdrantStorage -Force | Out-Null
    }

    docker rm -f $QdrantContainer 1>$null 2>$null
    $qdrantVolume = "$($QdrantStorage):/qdrant/storage"
    docker run -d --name $QdrantContainer -p 6333:6333 -p 6334:6334 -v $qdrantVolume $QdrantImage 1>$null 2>$null
    Write-Output (Write-Step "qdrant.run" $true "container=$QdrantContainer")
  }

  if ($doPullModel -and (Has-Cmd "ollama")) {
    ollama pull $ModelName
    Write-Output (Write-Step "ollama.pull" $true "model=$ModelName")
  }

  Write-Output (Write-Step "runtime.setup" $true "completed")
  exit 0
}
catch {
  Write-Output (Write-Step "runtime.setup" $false $_.Exception.Message)
  exit 2
}
