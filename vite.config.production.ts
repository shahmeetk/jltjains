import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Production configuration for GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/jltjains/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          query: ['@tanstack/react-query']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared')
    }
  },
  root: './client',
  publicDir: 'public',
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 3000,
    host: true
  }
})
