param(
    [int]$Port = 5174
)

$ErrorActionPreference = "Stop"

$appRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$packageJson = Join-Path $appRoot "package.json"
$nodeModules = Join-Path $appRoot "node_modules"
$logPath = Join-Path $env:TEMP "engineering-growth-studio-vite.log"
$errorLogPath = Join-Path $env:TEMP "engineering-growth-studio-vite.err.log"

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js is not installed or not on PATH. Install Node.js LTS and rerun this skill."
}

if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm is not installed or not on PATH. Install Node.js LTS and rerun this skill."
}

$npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (!$npmCommand) {
    $npmCommand = Get-Command npm -ErrorAction Stop
}

if (!(Test-Path $packageJson)) {
    throw "Cannot find package.json at $packageJson."
}

function Test-EngineeringGrowthStudio {
    param([string]$Url)

    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 2
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
    }
    catch {
        return $false
    }
}

Push-Location $appRoot
try {
    if (!(Test-Path $nodeModules)) {
        npm install
    }

    $url = "http://127.0.0.1:$Port"
    if (!(Test-EngineeringGrowthStudio -Url $url)) {
        $process = Start-Process `
            -FilePath $npmCommand.Source `
            -ArgumentList @("run", "dev", "--", "--host", "127.0.0.1", "--port", $Port, "--strictPort") `
            -WorkingDirectory $appRoot `
            -WindowStyle Hidden `
            -RedirectStandardOutput $logPath `
            -RedirectStandardError $errorLogPath `
            -PassThru

        $deadline = (Get-Date).AddSeconds(20)
        while ((Get-Date) -lt $deadline) {
            if ($process.HasExited) {
                $errorText = if (Test-Path $errorLogPath) { Get-Content $errorLogPath -Raw } else { "" }
                $outputText = if (Test-Path $logPath) { Get-Content $logPath -Raw } else { "" }
                throw "Engineering Growth Studio failed to start.`n$errorText`n$outputText"
            }

            if (Test-EngineeringGrowthStudio -Url $url) {
                break
            }

            Start-Sleep -Milliseconds 500
        }

        if (!(Test-EngineeringGrowthStudio -Url $url)) {
            throw "Engineering Growth Studio did not become available at $url. Logs: $logPath and $errorLogPath"
        }
    }

    Start-Process $url
    Write-Host "Engineering Growth Studio launched in your browser at $url."
}
finally {
    Pop-Location
}
