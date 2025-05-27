@echo off
REM JLT Jain Sangh Dubai Community Wall - Local Setup Script for Windows
REM This script sets up the application for local development

echo 🏗️  Setting up JLT Jain Sangh Dubai Community Wall for local development...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo Version: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ npm detected
for /f "tokens=1" %%i in ('npm --version') do set NPM_VERSION=%%i
echo Version: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Run type checking
echo.
echo 🔍 Running type checking...
npm run check
if %errorlevel% neq 0 (
    echo ❌ Type checking failed
    pause
    exit /b 1
)

REM Create data directory if it doesn't exist
echo.
echo 📁 Setting up data directory...
if not exist "data" mkdir data

REM Check if data/contributors.csv exists, if not create empty one
if not exist "data\contributors.csv" (
    echo id,name,createdAt > data\contributors.csv
    echo ✅ Created empty contributors.csv file
) else (
    echo ✅ contributors.csv already exists
)

echo.
echo 🎉 Setup complete! You can now run the application with:
echo.
echo    npm run local:dev     # Start development server
echo    npm run local:build   # Build for production  
echo    npm run local:start   # Start production server
echo.
echo 📖 For more information, see LOCAL_DEVELOPMENT.md
echo.
echo 🌐 The application will be available at: http://localhost:5000
echo.
pause
