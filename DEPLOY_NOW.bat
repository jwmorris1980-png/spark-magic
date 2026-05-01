@echo off
title Push Spark Magic Repairs to Google Cloud
echo ==================================================
echo    SPARK MAGIC: GOOGLE CLOUD DEPLOYER
echo ==================================================
echo.
echo Project: gen-lang-client-0007979237
echo Project Path: %~dp0
echo.
echo [System] Creating Pre-Flight Backup (Black Box)...
python scripts/daily_backup.py
echo.
echo [System] Starting Local Vibe Check (Zero Tokens)...
node scripts/VIBE_CHECK.cjs
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ DEPLOYMENT HALTED: Vibe check failed. Fix errors above.
    pause
    exit /b %ERRORLEVEL%
)

echo [1/2] Building and Pushing to Cloud Run...
echo (This may take 2-4 minutes)
echo.

set GCLOUD_BIN=gcloud
where gcloud >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    set GCLOUD_BIN="C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
    echo [System] Using absolute gcloud path...
)

echo [System] Starting AI Guardian Deployment...
%GCLOUD_BIN% run deploy spark-magic --project gen-lang-client-0007979237 --source . --region us-central1 --allow-unauthenticated --min-instances 1

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==================================================
    echo    ✅ DEPLOYMENT SUCCESSFUL!
    echo ==================================================
    echo.
    echo Your site at https://sparks-magic.com should be 
    echo updated in about 60 seconds.
) else (
    echo.
    echo ==================================================
    echo    ❌ DEPLOYMENT FAILED
    echo ==================================================
    echo Please check if you are logged in to gcloud:
    echo Run: gcloud auth login
)

echo.
pause
