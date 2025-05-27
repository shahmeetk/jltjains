@echo off
REM JLT Jain Sangh Dubai - Community Wall
REM Local Development Startup Script for Windows

echo 🏗️  Starting JLT Jain Sangh Dubai Community Wall
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🚀 Starting development server...
echo 📱 Open http://localhost:5000 in your browser
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev
