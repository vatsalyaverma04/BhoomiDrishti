@echo off
echo ===================================================
echo Stopping BhoomiDrishti Backend and Frontend Servers
echo ===================================================

echo [1/2] Checking and terminating processes on Port 8000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)

echo [2/2] Checking and terminating processes on Port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo All BhoomiDrishti servers stopped successfully!
pause
