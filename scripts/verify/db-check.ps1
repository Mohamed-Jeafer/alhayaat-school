param([string]$DatabaseUrl = $env:DATABASE_URL)
if (-not $DatabaseUrl) { Write-Error "DATABASE_URL not set"; exit 1 }
Write-Host "Verifying database schema..."
$result = psql $DatabaseUrl -f scripts/db/verify.sql 2>&1
if ($LASTEXITCODE -ne 0) { Write-Error "DB verification failed: $result"; exit 1 }
Write-Host "✅ Database schema verified"
