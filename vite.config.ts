import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "public/manifest.json", // path to your manifest
          dest: ".", // copy into /dist
        },
      ],
    }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        contentScript: resolve(__dirname, "src/contentScript.ts"), // entry point
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "contentScript") return "contentScript.js";
          return "assets/[name].js";
        },
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    emptyOutDir: true,
  },
});
