import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'blog/blog.html'),
        tools: resolve(__dirname, 'tool/index.html'),
        proyectos: resolve(__dirname, 'proyectos-bim/index.html'),
      },
    },
  },
  server: {
    open: true,
  },
});
