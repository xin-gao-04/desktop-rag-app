param(
  [string]$ModelName = "llama3.1:8b",
  [string]$OutputTar = ".\offline-assets\models\ollama-model-llama3.1-8b.tar"
)

$ErrorActionPreference = "Stop"

$modelRoot = Join-Path $env:USERPROFILE ".ollama\models"
if (-not (Test-Path $modelRoot)) {
  throw "ollama model root not found: $modelRoot"
}

$parts = $ModelName.Split(":")
if ($parts.Count -ne 2) {
  throw "ModelName format must be name:tag, got: $ModelName"
}
$name = $parts[0]
$tag = $parts[1]

$manifestPath = Join-Path $modelRoot "manifests\registry.ollama.ai\library\$name\$tag"
if (-not (Test-Path $manifestPath)) {
  throw "model manifest not found: $manifestPath (run: ollama pull $ModelName)"
}

$manifest = Get-Content -Raw -Path $manifestPath | ConvertFrom-Json
$digests = @()
$digests += $manifest.config.digest
foreach ($l in $manifest.layers) { $digests += $l.digest }
$digests = $digests | Where-Object { $_ } | Select-Object -Unique

$tmp = Join-Path $env:TEMP ("ollama-export-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tmp -Force | Out-Null

$targetManifestDir = Join-Path $tmp "manifests\registry.ollama.ai\library\$name"
New-Item -ItemType Directory -Path $targetManifestDir -Force | Out-Null
Copy-Item -Path $manifestPath -Destination (Join-Path $targetManifestDir $tag) -Force

$targetBlobDir = Join-Path $tmp "blobs"
New-Item -ItemType Directory -Path $targetBlobDir -Force | Out-Null
foreach ($d in $digests) {
  $blobFile = $d.Replace(":", "-")
  $src = Join-Path $modelRoot ("blobs\" + $blobFile)
  if (-not (Test-Path $src)) {
    throw "missing blob for digest $d at $src"
  }
  Copy-Item -Path $src -Destination (Join-Path $targetBlobDir $blobFile) -Force
}

New-Item -ItemType Directory -Path (Split-Path -Parent $OutputTar) -Force | Out-Null
if (Test-Path $OutputTar) { Remove-Item $OutputTar -Force }
tar -C $tmp -cf $OutputTar manifests blobs
if ($LASTEXITCODE -ne 0) {
  throw "failed to create tar: $OutputTar"
}

$size = (Get-Item $OutputTar).Length
Write-Output "MODEL_EXPORT_OK=$OutputTar size=$size"

Remove-Item -Path $tmp -Recurse -Force
