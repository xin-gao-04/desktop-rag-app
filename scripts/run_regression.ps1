param()
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
npm test
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host 'Desktop regression passed.'
