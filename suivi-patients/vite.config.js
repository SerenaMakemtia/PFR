import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/resources/js',
    },
  },
  server: {
    host: true,
    hmr: {
      host: 'localhost',
    },
  },
});
