/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./__tests__/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "__tests__/",
        ".next/",
        "dist/",
        "*.config.{ts,js}",
        "src/vite-env.d.ts",
        "src/components/ui/**",
      ],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});
