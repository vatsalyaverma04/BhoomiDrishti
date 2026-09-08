@echo off
echo ===================================================
echo Starting BhoomiDrishti AI - DILRMP Platform
echo ===================================================
echo.
echo Starting Backend (FastAPI on http://127.0.0.1:8000)...
start "BhoomiDrishti Backend Server (Port 8000)" cmd /k "cd /d %~dp0backend && venv\Scripts\python.exe run.py"

timeout /t 2 /nobreak >nul

echo Starting Frontend (Vite React on http://127.0.0.1:5173)...
start "BhoomiDrishti Frontend Web UI (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo ===================================================
echo Both servers launched in separate visible windows!
echo - Web Portal: http://127.0.0.1:5173
echo - API Docs:   http://127.0.0.1:8000/docs
echo.
echo To STOP the servers, simply close those two command prompt
echo windows, or double-click "stop_servers.bat".
echo ===================================================
timeout /t 5
