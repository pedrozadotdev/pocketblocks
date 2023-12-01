import { defineConfig } from "vite";
import * as path from "path";

export default defineConfig({
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  server: {
    proxy: {
      "/_": "http://127.0.0.1:8090",
      "/api/realtime": {
        target: "ws://127.0.0.1:8090",
        ws: true,
      },
      "/api": "http://127.0.0.1:8090",
    },
    host: "0.0.0.0",
  },
  plugins: [
    (() => ({
      name: "transform-html",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          return html.replace(
            "<!-- PROXYSCRIPT -->",
            `<script type="module" src="/src/main.ts"></script>`,
          );
        },
      },
    }))(),
    (() => ({
      name: "transform-html",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          return html
            .replace(`src="/js/proxy.js"`, `src="/js/index.js"`)
            .replace(`src="/js/index.js"`, `src="/js/proxy.js"`);
        },
      },
      apply: "build",
    }))(),
  ],
  build: {
    manifest: false,
    emptyOutDir: true,
    target: "es2015",
    cssTarget: "chrome63",
    outDir: "../server/ui/dist",
    rollupOptions: {
      output: {
        chunkFileNames: "js/[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        entryFileNames: "js/proxy.js",
      },
    },
  },
});
