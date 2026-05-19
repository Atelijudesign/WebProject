import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: './',
  resolve: {
    alias: {
      stream: 'stream-browserify',
      path: 'path-browserify',
      events: 'events',
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  server: {
    open: true,
  },
});
