import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

import fs from 'fs';

const backendExists = fs.existsSync(path.resolve(__dirname, '../backend'));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: backendExists ? '../backend/src/main/resources/static' : 'dist',
    emptyOutDir: true,
  },
});
