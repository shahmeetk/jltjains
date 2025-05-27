#!/usr/bin/env node

/**
 * Test script to verify GitHub Pages deployment locally
 * This simulates the exact same process as GitHub Actions
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

console.log('🧪 Testing GitHub Pages Deployment Locally\n');

try {
  // Step 1: Clean previous build
  console.log('1️⃣ Cleaning previous build...');
  if (existsSync('client/dist')) {
    execSync('rm -rf client/dist', { stdio: 'inherit' });
  }

  // Step 2: Build for GitHub Pages
  console.log('2️⃣ Building for GitHub Pages...');
  execSync('npm run build:gh-pages', { stdio: 'inherit' });

  // Step 3: Add .nojekyll file
  console.log('3️⃣ Adding .nojekyll file...');
  execSync('touch client/dist/.nojekyll', { stdio: 'inherit' });

  // Step 4: Verify build output
  console.log('4️⃣ Verifying build output...');
  const distPath = 'client/dist';
  const files = execSync(`ls -la ${distPath}`, { encoding: 'utf8' });
  console.log(files);

  // Step 5: Check index.html content
  console.log('5️⃣ Checking index.html content...');
  const indexPath = path.join(distPath, 'index.html');
  if (existsSync(indexPath)) {
    const content = readFileSync(indexPath, 'utf8');
    
    // Check for correct base path
    if (content.includes('/jltjains/')) {
      console.log('✅ Base path is correct: /jltjains/');
    } else {
      console.log('❌ Base path is incorrect!');
      console.log('Expected: /jltjains/');
      console.log('Found paths:', content.match(/href="[^"]*"/g) || []);
    }

    // Check for required assets
    const requiredAssets = ['index.html', 'jlt-logo.png'];
    const assetDir = path.join(distPath, 'assets');
    
    for (const asset of requiredAssets) {
      const assetPath = path.join(distPath, asset);
      if (existsSync(assetPath)) {
        console.log(`✅ ${asset} exists`);
      } else {
        console.log(`❌ ${asset} missing`);
      }
    }

    if (existsSync(assetDir)) {
      const assetFiles = execSync(`ls ${assetDir}`, { encoding: 'utf8' }).split('\n').filter(Boolean);
      console.log(`✅ Assets directory contains ${assetFiles.length} files:`, assetFiles);
    } else {
      console.log('❌ Assets directory missing');
    }

  } else {
    console.log('❌ index.html not found!');
  }

  // Step 6: Start preview server
  console.log('\n6️⃣ Starting preview server...');
  console.log('🌐 Testing at: http://localhost:3000/jltjains/');
  console.log('📝 Press Ctrl+C to stop the server\n');
  
  execSync('npm run preview:gh-pages', { stdio: 'inherit' });

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
