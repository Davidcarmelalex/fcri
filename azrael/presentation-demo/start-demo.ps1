param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$demoDirectory = $PSScriptRoot
$coreDirectory = Join-Path (Split-Path $demoDirectory -Parent) 'azrael-core/src'
$demoUrl = 'http://127.0.0.1:3089/'
$runtimeCandidates = @(
  (Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe')
)
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if ($pythonCommand -and $pythonCommand.Source -notlike '*WindowsApps*') { $runtimeCandidates += $pythonCommand.Source }
$demoPython = $runtimeCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $demoPython) { throw 'Install Python 3.11 or newer, then run this launcher again.' }
if (-not (Test-Path -LiteralPath (Join-Path $coreDirectory 'azrael_core/orchestrator.py'))) { throw 'Extract the complete presentation ZIP before starting the demo.' }
$alreadyRunning = $false
try {
  $health = Invoke-RestMethod ($demoUrl + 'healthz') -TimeoutSec 2
  $alreadyRunning = $health.ok -and $health.mode -eq 'simulation'
} catch { }
if (-not $alreadyRunning) {
  $env:PYTHONPATH = $coreDirectory
  $env:HOST = '127.0.0.1'
  $env:PORT = '3089'
  $logDirectory = Join-Path $demoDirectory '.demo-logs'
  New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null
  $demoProcess = Start-Process -FilePath $demoPython -ArgumentList @('server.py') -WorkingDirectory $demoDirectory -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDirectory 'server.log') -RedirectStandardError (Join-Path $logDirectory 'error.log') -PassThru
  Set-Content -LiteralPath (Join-Path $logDirectory 'server.pid') -Value $demoProcess.Id
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    try { $health = Invoke-RestMethod ($demoUrl + 'healthz') -TimeoutSec 1; if ($health.ok) { break } } catch { }
    Start-Sleep -Milliseconds 250
  }
  if (-not $health.ok) { throw 'The demo did not start. Inspect .demo-logs/error.log.' }
}
if (-not $NoBrowser) { Start-Process $demoUrl }
Write-Output "AZRAEL presentation demo is ready: $demoUrl"
