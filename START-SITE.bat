@echo off
setlocal
cd /d "%~dp0"

set PORT=5500

echo.
echo ==========================================
echo   Spider-Man Movie Site - Local Server
echo ==========================================
echo.
echo Opening http://localhost:%PORT%/
echo Keep this window open while using the site.
echo.

where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%/"
  py -m http.server %PORT%
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%/"
  python -m http.server %PORT%
  goto :eof
)

echo Python was not found on this PC.
echo.
echo Alternative:
echo   1. Open this folder in VS Code.
echo   2. Install the Live Server extension.
echo   3. Right-click index.html ^> Open with Live Server.
echo.
pause
