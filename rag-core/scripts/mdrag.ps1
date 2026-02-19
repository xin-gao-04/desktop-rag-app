$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
if (-not $env:PYTHONPATH) { $env:PYTHONPATH = "$root\src" } else { $env:PYTHONPATH = "$root\src;$env:PYTHONPATH" }
python -m mdrag.cli @args
exit $LASTEXITCODE
