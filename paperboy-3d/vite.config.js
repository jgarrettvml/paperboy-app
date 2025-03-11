import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base public path
  base: './',
  
  // Resolve paths
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  // Server options
  server: {
    port: 3000,
    open: true
  },
  
  // Specify root directory (where index.html is located)
  root: 'src',
  
  // Build options
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
});