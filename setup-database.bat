@echo off
REM ========================================
REM Predix Database Setup
REM Creates database and runs migrations
REM ========================================

echo.
echo ========================================
echo   PREDIX DATABASE SETUP
echo ========================================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL command 'psql' not found!
    echo Please ensure PostgreSQL is installed and in PATH
    pause
    exit /b 1
)

echo [1/4] Creating database and user...
echo.

REM Create database and user
psql -U postgres -c "CREATE USER predix_user WITH PASSWORD 'predix_pass';" 2>nul
psql -U postgres -c "CREATE DATABASE predix_db OWNER predix_user;" 2>nul
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE predix_db TO predix_user;" 2>nul

echo Database 'predix_db' created (or already exists)
echo User 'predix_user' created (or already exists)
echo.

echo [2/4] Running migrations...
echo.

REM Run migrations in order
for %%f in (database\migrations\*.sql) do (
    echo Running migration: %%f
    psql -U predix_user -d predix_db -f "%%f"
)

echo.
echo [3/4] Creating indexes...
psql -U predix_user -d predix_db -f "database\indexes.sql"

echo.
echo [4/4] Verifying database...
psql -U predix_user -d predix_db -c "\dt"

echo.
echo ========================================
echo   DATABASE SETUP COMPLETE!
echo ========================================
echo.
echo Database: predix_db
echo User:     predix_user
echo Password: predix_pass
echo Host:     localhost:5432
echo.
echo You can now start the platform with:
echo   start-local.bat
echo.
pause
