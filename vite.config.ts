import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["lucide-react"],
        },
      },
    },
  },
  server: {
    port: 3003, // Match your actual running port
    host: "0.0.0.0", // Allow external connections for DevBox
    strictPort: false, // Allow Vite to use different port if 3003 is taken
    allowedHosts: [
      "glnnc7-3003.csb.app", // Your specific DevBox host
      ".csb.app", // Allow all CodeSandbox DevBox hosts
      "localhost",
    ],
    cors: true,
  },
});
