# ---------------------------------------------------------------------------
# Removes files left over from the old structure.
#
# The split moved this project's code to a new layout, and the sync that wrote
# the new files could not delete the old ones. Everything listed below is
# either superseded or dead. All three projects are git repositories, so
# `git status` will show exactly what went, and `git checkout -- <path>`
# brings anything back.
#
#   .\cleanup-legacy.ps1          # dry run - lists what WOULD be deleted
#   .\cleanup-legacy.ps1 -Apply   # actually deletes
# ---------------------------------------------------------------------------
param([switch]$Apply)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$paths = @(
  'app',
  'CLAUDE.md',
  'public/file.svg',
  'public/globe.svg',
  'public/next.svg',
  'public/vercel.svg',
  'public/window.svg',
  '.next',
  'tsconfig.tsbuildinfo',
)

$found = 0
foreach ($rel in $paths) {
  $full = Join-Path $root $rel
  foreach ($item in @(Get-Item -LiteralPath $full -ErrorAction SilentlyContinue)) {
    $found++
    if ($Apply) {
      Remove-Item -LiteralPath $item.FullName -Recurse -Force
      Write-Host "deleted  $rel" -ForegroundColor Yellow
    } else {
      Write-Host "would delete  $rel" -ForegroundColor Cyan
    }
  }
}

if ($found -eq 0) {
  Write-Host "Nothing left to clean up." -ForegroundColor Green
} elseif ($Apply) {
  Write-Host ""
  Write-Host "$found path(s) removed. Now run:  npm install ; npm run build" -ForegroundColor Green
} else {
  Write-Host ""
  Write-Host "$found path(s) would be removed. Re-run with -Apply to do it." -ForegroundColor Green
}
