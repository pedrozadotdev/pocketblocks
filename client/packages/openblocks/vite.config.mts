import dotenv from "dotenv";
import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import checker from "vite-plugin-checker";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import { ensureLastSlash } from "openblocks-dev-utils/util";
import { buildVars } from "openblocks-dev-utils/buildVars";
import { globalDepPlugin } from "openblocks-dev-utils/globalDepPlguin";

dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? "development";
const isDev = nodeEnv === "development";
const isVisualizerEnabled = !!process.env.ENABLE_VISUALIZER;
const base = ensureLastSlash(process.env.PUBLIC_URL);


const define = {};
buildVars.forEach(({ name, defaultValue }) => {
  define[name] = JSON.stringify(process.env[name] || defaultValue);
});

// https://vitejs.dev/config/
export const viteConfig: UserConfig = {
  define,
  assetsInclude: ["**/*.md"],
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    alias: {
      "@openblocks-ee": path.resolve(
        __dirname,
        "../openblocks/src"
      ),
    },
  },
  base,
  build: {
    manifest: true,
    target: "es2015",
    cssTarget: "chrome63",
    outDir: "../../../proxy/public",
    emptyOutDir: false,
    rollupOptions: {
      external: ["/js/proxy.js"],
      input: {
        main: path.resolve(__dirname, "index.html"),
        embedded: path.resolve(__dirname, "embedded.html"),
      },
      output: {
        chunkFileNames: "js/[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        entryFileNames: "js/[name].js"
      },
    },
    commonjsOptions: {
      defaultIsModuleExports: (id) => {
        if (id.indexOf("antd/lib") !== -1) {
          return false;
        }
        return "auto";
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "@primary-color": "#3377FF",
          "@link-color": "#3377FF",
          "@border-color-base": "#D7D9E0",
          "@border-radius-base": "4px",
        },
        javascriptEnabled: true,
      },
    },
  },
  server: {
    proxy: {
      "/js/proxy.js": "http://127.0.0.1:8090",
      "/_": "http://127.0.0.1:8090",
      "/api/realtime": {
        target: "ws://127.0.0.1:8090",
        ws: true,
      },
      "/api": "http://127.0.0.1:8090",
      "/cc": "http://127.0.0.1:8090"
    },
    host: "0.0.0.0"
  },
  plugins: [
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint --quiet "./src/**/*.{ts,tsx}"',
        dev: {
          logLevel: ["error"],
        },
      },
    }),
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy"],
        },
      },
    }),
    viteTsconfigPaths({
      projects: ["../openblocks/tsconfig.json", "../openblocks-design/tsconfig.json"],
    }),
    svgrPlugin({
      svgrOptions: {
        exportType: "named",
        prettier: false,
        svgo: false,
        titleProp: true,
        ref: true,
      },
    }),
    globalDepPlugin(),
    createHtmlPlugin({
      minify: false,
      pages: [
        {
          filename: "index.html",
          template: '/index.html',
          injectOptions: {
            data: {
              browserCheckScript: isDev ? "" : `<script src="/js/browser-check.js"></script>`,
              proxyScript: isDev ? `<script type="module" crossorigin src="/js/proxy.js"></script>` : `<!-- PROXYSCRIPT -->`,
            },
          }
        },
      ]
    }),
    isVisualizerEnabled && visualizer(),
  ].filter(Boolean),
};

const browserCheckConfig: UserConfig = {
  ...viteConfig,
  plugins: [...(viteConfig.plugins?.slice(0,5) || []), isVisualizerEnabled && visualizer()].filter(Boolean),
  define: {
    ...viteConfig.define,
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    ...viteConfig.build,
    rollupOptions: {
      output: viteConfig.build?.rollupOptions?.output
    },
    manifest: false,
    copyPublicDir: false,
    emptyOutDir: true,
    lib: {
      formats: ["iife"],
      name: "BrowserCheck",
      entry: "./src/browser-check.ts"
    },
  },
};

const buildTargets = {
  main: viteConfig,
  browserCheck: browserCheckConfig,
};

const buildTarget = buildTargets[process.env.BUILD_TARGET || "main"];

export default defineConfig(buildTarget || viteConfig);
