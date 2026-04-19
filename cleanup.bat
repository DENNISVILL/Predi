@echo off
echo Limpiando proyecto Predix...

echo Eliminando carpetas de Capacitor...
rmdir /s /q android 2>nul
rmdir /s /q ios 2>nul
del /q capacitor.config.ts 2>nul

echo Eliminando backend Node.js...
del /q backend\server.js 2>nul
del /q backend\package.json 2>nul
del /q backend\package-lock.json 2>nul
del /q backend\database.js 2>nul
del /q backend\emailService.js 2>nul
del /q backend\spotifyService.js 2>nul
del /q backend\setupDb.js 2>nul
del /q backend\testConnection.js 2>nul
del /q backend\migrate_tokens.js 2>nul

echo Eliminando package.json redundante en src...
del /q src\package.json 2>nul

echo Limpieza completada.
