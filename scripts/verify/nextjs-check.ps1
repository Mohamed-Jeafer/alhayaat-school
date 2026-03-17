Write-Host "Checking Next.js build..."
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Build failed"; exit 1 }
Write-Host "Checking lint..."
npm run lint
if ($LASTEXITCODE -ne 0) { Write-Error "Lint failed"; exit 1 }
Write-Host "✅ Next.js verification passed"
