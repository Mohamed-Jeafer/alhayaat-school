# compare.ps1
# Runs the full Webflow vs Next.js comparison suite.
# Both servers are auto-managed by playwright.config.ts webServer entries,
# so this script just triggers the tests and opens the report.

param(
  [string]$Suite = "all",       # all | visual | content | forms | styles
  [string]$Project = "desktop", # desktop | mobile
  [switch]$Report               # open report after run
)

$env:PLAYWRIGHT_HTML_REPORT = "playwright-report"

$specMap = @{
  "visual"  = "visual.spec.ts"
  "content" = "content.spec.ts"
  "forms"   = "forms.spec.ts"
  "styles"  = "styles.spec.ts"
}

$specArg = if ($Suite -eq "all") { "" } else { "tests/compare/$($specMap[$Suite])" }
$projectArg = "--project=$Project"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  Webflow vs Next.js Comparison" -ForegroundColor Cyan
Write-Host "  Suite  : $Suite" -ForegroundColor Cyan
Write-Host "  Project: $Project" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Playwright will start both servers automatically:" -ForegroundColor Gray
Write-Host "  → Webflow static  : http://localhost:3001" -ForegroundColor Gray
Write-Host "  → Next.js dev     : http://localhost:3000" -ForegroundColor Gray
Write-Host ""

$cmd = "npx playwright test $specArg $projectArg --reporter=html,list"
Write-Host "Running: $cmd" -ForegroundColor Yellow
Write-Host ""

Invoke-Expression $cmd
$exitCode = $LASTEXITCODE

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if ($exitCode -eq 0) {
  Write-Host "  ✓ All comparisons passed!" -ForegroundColor Green
} else {
  Write-Host "  ✗ Some comparisons failed — check the report for details." -ForegroundColor Red
}

Write-Host ""
Write-Host "  Screenshots  : test-results/screenshots/" -ForegroundColor Gray
Write-Host "  HTML Report  : playwright-report/index.html" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if ($Report -or $exitCode -ne 0) {
  Write-Host ""
  Write-Host "Opening Playwright report..." -ForegroundColor Cyan
  npx playwright show-report
}

exit $exitCode
