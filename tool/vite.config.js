import { defineConfig } from "vite";

export default defineConfig({
  // Sirve todo desde el directorio actual (tool/)
  root: "./",
  server: {
    port: 3000,
    open: "/ifc-viewer.html",
  },
  build: {
    outDir: "../dist/tool",
    emptyOutDir: true,
  },
});
