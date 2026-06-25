import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// A simple plugin to start the local DB server automatically during development
function localDbServerPlugin() {
  let serverProcess = null;
  return {
    name: 'local-db-server',
    configureServer(server) {
      if (process.env.NODE_ENV === 'production') return;
      
      console.log('\x1b[36m%s\x1b[0m', '>> [Vite Plugin] Starting local DB server on port 3001...');
      serverProcess = fork(resolve(__dirname, 'server.js'));
      
      serverProcess.on('error', (err) => {
        console.error('Failed to start local DB server:', err);
      });

      serverProcess.on('exit', (code) => {
        if (code && code !== 0) {
          console.error(`Local DB server exited with code ${code}`);
        }
      });

      const killChild = () => { if (serverProcess) serverProcess.kill(); };
      process.on('exit',   killChild);
      process.on('SIGTERM', () => { killChild(); process.exit(0); });
      process.on('SIGINT',  () => { killChild(); process.exit(0); });
    },
    closeBundle() {
      if (serverProcess) {
        console.log('\x1b[36m%s\x1b[0m', '>> [Vite Plugin] Stopping local DB server...');
        serverProcess.kill();
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), localDbServerPlugin()],
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

