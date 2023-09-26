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
  },
});
