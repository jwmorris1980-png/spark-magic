@echo off
title Spark Server Launcher
echo ==========================================
echo    SPARK GLOBAL PROJECT LAUNCHER
echo ==========================================
echo.

:: 1. Launch Local Magic Brain (Python/FastAPI)
echo [1/3] Starting Local Magic Brain (Port 8000)...
start "Spark Magic Brain" /B python local_magic_server.py

:: 2. Launch Magic Proxy (NodeJS)
echo [2/3] Starting Magic Proxy Server (Port 3001)...
start "Spark Proxy" /B node server.cjs

:: 3. Launch Frontend (Vite)
echo [3/3] Starting Spark Frontend (Port 5173)...
start "Spark Frontend" /B npm run dev

echo.
echo ==========================================
echo    ALL SYSTEMS INITIATED
echo ==========================================
echo.
echo Port 5173: Frontend
echo Port 3001: Proxy/Backend
echo Port 8000: Local AI Brain
echo.
echo Use 'netstat -ano ^| findstr :5173' to check status.
echo.
timeout /t 5 >nul
exit /b 0
