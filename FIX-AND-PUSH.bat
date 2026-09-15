@echo off
setlocal
cd /d "%~dp0"
title Fix and deploy - senal-group

echo.
echo ===============================================================
echo   senal-group  -  remove the old files, build, commit, push
echo ===============================================================
echo.
echo Close any running "npm run dev" for this project first.
echo On Windows a dev server and a build both write to .next and
echo corrupt each other.
echo.
pause

echo.
echo --- 1/5  removing superseded files -----------------------------
powershell -NoProfile -Command "if (Test-Path -LiteralPath 'app') { Remove-Item -LiteralPath 'app' -Recurse -Force; Write-Host '    removed  app' }"
powershell -NoProfile -Command "if (Test-Path -LiteralPath 'CLAUDE.md') { Remove-Item -LiteralPath 'CLAUDE.md' -Recurse -Force; Write-Host '    removed  CLAUDE.md' }"
powershell -NoProfile -Command "if (Test-Path -LiteralPath 'public\file.svg') { Remove-Item -LiteralPath 'public\file.svg' -Recurse -Force; Write-Host '    removed  public\file.svg' }"
powershell -NoProfile -Command "if (Test-Path -LiteralPath 'public\globe.svg') { Remove-Item -LiteralPath 'public\globe.svg' -Recurse -Force; Write-Host '    removed  public\globe.svg' }"
powershell -NoProfile -Command "if (Test-Path -LiteralPath 'public\next.svg') { Remove-Item -LiteralPath 'public\next.svg' -Recurse -Force; Write-Host '    removed  public\next.svg' }"
powershell -NoProfile -Command "if (Test-Path -LiteralPath 'public\vercel.svg') { Remove-Item -LiteralPath 'public\vercel.svg' -Recurse -Force; Write-Host '    removed  public\vercel.svg' }"
powershell -NoProfile -Command "if (Test-Path -LiteralPath 'public\window.svg') { Remove-Item -LiteralPath 'public\window.svg' -Recurse -Force; Write-Host '    removed  public\window.svg' }"
powershell -NoProfile -Command "if (Test-Path -LiteralPath '.next') { Remove-Item -LiteralPath '.next' -Recurse -Force; Write-Host '    removed  .next' }"
powershell -NoProfile -Command "if (Test-Path -LiteralPath 'tsconfig.tsbuildinfo') { Remove-Item -LiteralPath 'tsconfig.tsbuildinfo' -Recurse -Force; Write-Host '    removed  tsconfig.tsbuildinfo' }"
echo     done.

echo.
echo --- 2/5  installing dependencies ------------------------------
echo     node_modules here predates the new package.json, so cross-env,
echo     payload and the rest are missing. Vercel runs this itself; the
echo     local build needs it too.
call npm install
if errorlevel 1 (
  echo.
  echo   npm install FAILED. Nothing committed or pushed.
  echo.
  pause
  exit /b 1
)

echo.
echo --- 3/5  building ---------------------------------------------
call npm run build
if errorlevel 1 (
  echo.
  echo   BUILD FAILED. Nothing has been committed or pushed.
  echo   Scroll up and find the line starting "Module not found"
  echo   or the first error, and send it over.
  echo.
  pause
  exit /b 1
)
echo     build OK.

echo.
echo --- 4/5  staging ----------------------------------------------
git add -A
git status --short

echo.
echo --- 5/5  commit and push --------------------------------------
git commit -m "Remove superseded pre-split files" || echo     (nothing new to commit)
git push
if errorlevel 1 (
  echo.
  echo   PUSH FAILED - check the message above ^(auth, or no upstream^).
  echo   If it says no upstream:  git push -u origin HEAD
  echo.
  pause
  exit /b 1
)

echo.
echo ===============================================================
echo   Done. Vercel will pick up the push and rebuild.
echo ===============================================================
echo.
pause
