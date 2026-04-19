@echo off
REM ========================================
REM Predix Database Setup (Python Alembic)
REM ========================================

echo.
echo ========================================
echo   PREDIX DATABASE SETUP
echo ========================================
echo.

where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL command 'psql' not found!
    pause
    exit /b 1
)

echo [1/3] Creating database and user...
psql -U postgres -c "CREATE USER predix_user WITH PASSWORD 'predix_pass';" 2>nul
psql -U postgres -c "CREATE DATABASE predix_db OWNER predix_user;" 2>nul
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE predix_db TO predix_user;" 2>nul

echo.
echo [2/3] Running Alembic Migrations...
cd backend
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
alembic upgrade head
cd ..

echo.
echo [3/3] Verifying database...
psql -U predix_user -d predix_db -c "\dt"

echo.
echo ========================================
echo   DATABASE SETUP COMPLETE!
echo ========================================
pause
