import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 1. Enabling the React Compiler for automatic optimization
      babel: {
        plugins: [["babel-plugin-react-compiler", {}]],
      },
    }),
  ],
  server: {
    // 2. Proxying /api calls to your Express server
    proxy: {
      "/api": {
        target: "http://13.232.170.48:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});