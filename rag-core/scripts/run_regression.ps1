param(
  [string]$Python = "python"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$outputLog = ".\\docs\\regression_output.log"
$reportFile = ".\\docs\\test_report.md"
if (Test-Path $outputLog) { Remove-Item $outputLog -Force }

& $Python -m pip install -r requirements.txt | Out-Host
if (-not $env:PYTHONPATH) { $env:PYTHONPATH = "$root\\src" } else { $env:PYTHONPATH = "$root\\src;$env:PYTHONPATH" }
& $Python -m pytest -q | Tee-Object -FilePath $outputLog

if ($LASTEXITCODE -ne 0) {
  Write-Error "Regression failed"
  exit $LASTEXITCODE
}

"Regression completed at $(Get-Date -Format o)" | Set-Content -Path $reportFile -Encoding UTF8
Get-Content $outputLog | Add-Content -Path $reportFile
Write-Host "Report written to docs/test_report.md"
