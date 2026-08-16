import {
  defineConfig,
} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
  ],

  base:
    "./",

  build: {
    outDir:
      "dist",

    emptyOutDir:
      true,

    rollupOptions: {
      output: {
        manualChunks(
          moduleId
        ) {
          if (
            !moduleId.includes(
              "node_modules"
            )
          ) {
            return;
          }

          if (
            moduleId.includes(
              "/node_modules/react/"
            ) ||
            moduleId.includes(
              "/node_modules/react-dom/"
            ) ||
            moduleId.includes(
              "/node_modules/scheduler/"
            )
          ) {
            return "react-vendor";
          }

          if (
            moduleId.includes(
              "/node_modules/@supabase/"
            )
          ) {
            return "supabase-vendor";
          }

          if (
            moduleId.includes(
              "/node_modules/@capacitor/"
            )
          ) {
            return "capacitor-vendor";
          }

          if (
            moduleId.includes(
              "/node_modules/lucide-react/"
            )
          ) {
            return "icons-vendor";
          }

          return "vendor";
        },
      },
    },
  },
});