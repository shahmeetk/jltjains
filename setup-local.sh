#!/bin/bash

# JLT Jain Sangh Dubai Community Wall - Local Setup Script
# This script sets up the application for local development

set -e  # Exit on any error

echo "🏗️  Setting up JLT Jain Sangh Dubai Community Wall for local development..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "Please update Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type checking
echo ""
echo "🔍 Running type checking..."
npm run check

# Create data directory if it doesn't exist
echo ""
echo "📁 Setting up data directory..."
mkdir -p data

# Check if data/contributors.csv exists, if not create empty one
if [ ! -f "data/contributors.csv" ]; then
    echo "id,name,createdAt" > data/contributors.csv
    echo "✅ Created empty contributors.csv file"
else
    echo "✅ contributors.csv already exists"
fi

echo ""
echo "🎉 Setup complete! You can now run the application with:"
echo ""
echo "   npm run local:dev     # Start development server"
echo "   npm run local:build   # Build for production"
echo "   npm run local:start   # Start production server"
echo ""
echo "📖 For more information, see LOCAL_DEVELOPMENT.md"
echo ""
echo "🌐 The application will be available at: http://localhost:5000"
