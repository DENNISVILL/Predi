@echo off
REM ========================================
REM Predix Platform - Local Development
REM Start Script for Windows
REM ========================================

echo.
echo ========================================
echo   PREDIX PLATFORM - LOCAL STARTUP
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed!
    pause
    exit /b 1
)

echo [1/4] Checking prerequisites...
node --version
python --version
echo.

echo [2/4] Preparando Backend (Python)...
cd backend
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..
echo.

REM Start PostgreSQL check here if needed...

echo [3/4] Starting Services...
echo.
echo ========================================
echo   Starting Frontend (Vite) on :3000
echo   Starting Backend (FastAPI) on :8000
echo ========================================
echo.

REM Start backend in new window
start "Predix Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
start "Predix Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   PREDIX IS STARTING!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop all services...
pause >nul

REM Stop services
echo Stopping services...
taskkill /FI "WindowTitle eq Predix*" /F

echo.
echo Predix stopped. Goodbye!
