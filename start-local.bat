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
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed!
    echo Please install Python 3.11+ from https://www.python.org/
    pause
    exit /b 1
)

echo [1/6] Checking prerequisites...
echo Node.js version:
node --version
echo Python version:
python --version
echo.

REM Install frontend dependencies
echo [2/6] Installing frontend dependencies...
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
) else (
    echo npm packages already installed (skip)
)
echo.

REM Install backend dependencies
echo [3/6] Installing backend dependencies...
cd backend
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python packages...
pip install -r requirements.txt
cd ..
echo.

REM Setup environment variables
echo [4/6] Setting up environment...
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
) else (
    echo .env file exists (skip)
)

if not exist "backend\.env" (
    echo Creating backend .env file...
    copy backend\.env.example backend\.env
) else (
    echo backend .env exists (skip)
)
echo.

REM Start services
echo [5/6] Starting services...
echo.

REM Start Redis (if using Docker)
echo Checking Redis...
docker ps | findstr redis >nul 2>nul
if %errorlevel% neq 0 (
    echo Starting Redis container...
    docker run -d -p 6379:6379 --name predix-redis redis:latest
) else (
    echo Redis already running
)
echo.

REM Start PostgreSQL (assuming it's running as service)
echo Checking PostgreSQL...
sc query postgresql-x64-14 | findstr RUNNING >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL service not running
    echo Please start PostgreSQL manually or run:
    echo   net start postgresql-x64-14
    echo.
)

echo [6/6] Starting Predix Platform...
echo.
echo ========================================
echo   Starting Frontend (React) on :3000
echo   Starting Backend (FastAPI) on :8000
echo ========================================
echo.

REM Start backend in new window
start "Predix Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
start "Predix Frontend" cmd /k "npm start"

echo.
echo ========================================
echo   PREDIX IS STARTING!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo GraphQL:  http://localhost:8000/graphql
echo.
echo Press any key to stop all services...
pause >nul

REM Stop services
echo.
echo Stopping services...
taskkill /FI "WindowTitle eq Predix*" /F
docker stop predix-redis

echo.
echo Predix stopped. Goodbye!
