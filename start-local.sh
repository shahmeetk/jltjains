#!/bin/bash

# JLT Jain Sangh Dubai - Community Wall
# Local Development Startup Script

echo "🏗️  Starting JLT Jain Sangh Dubai Community Wall"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Find available port
PORT=5000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; do
    echo "⚠️  Port $PORT is in use, trying $((PORT+1))..."
    PORT=$((PORT+1))
done

echo "🚀 Starting development server on port $PORT..."
echo "📱 Open http://localhost:$PORT in your browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
PORT=$PORT npm run dev
