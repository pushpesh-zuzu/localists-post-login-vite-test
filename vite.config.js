import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode, ssrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");

  let appUrl;
  try {
    appUrl = new URL(env.VITE_REACT_HOME_URL);
  } catch {
    appUrl = new URL(`http://${env.HOST}:${env.PORT}/`);
  }

  const output = {
    assetFileNames: "assets/[name]-[hash][extname]",
    chunkFileNames: "assets/[name]-[hash].js",
    entryFileNames: "assets/[name]-[hash].js",
    // Only apply manualChunks to client build; SSR build externalizes deps by default
    ...(ssrBuild
      ? {}
      : {
          manualChunks: {
            react: ["react", "react-dom"],
            router: ["react-router", "react-router-dom"],
            redux: ["@reduxjs/toolkit", "react-redux"],
            antd: ["antd", "@ant-design/icons"],
            vendor_misc: [
              "framer-motion",
              "keen-slider",
              "moment",
              "moment-timezone",
              "react-toastify",
            ],
          },
        }),
  };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "react-helmet-async": "react-helmet-async/lib/index.esm.js",
      },
    },
    ssr: {
      noExternal: ["react-helmet-async", "react-easy-crop"],
    },
    build: {
      outDir: "dist/client",
      manifest: true,
      chunkSizeWarningLimit: 2048,
      sourcemap: true,
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name]-[hash][extname]",
          chunkFileNames: "assets/[name]-[hash].js",
          // Ensure SSR bundle predictable name for server import
          entryFileNames: ssrBuild
            ? "entry-server.js"
            : "assets/[name]-[hash].js",
        },
      },
    },
    server: {
      host: env.HOST,
      port: parseInt(env.PORT),
      strictPort: true,
      hmr: {
        port: env.HMR_PORT ? parseInt(env.HMR_PORT) : 24680,
      },
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    },
    preview: {
      host: env.PREVIEW_HOST,
      port: parseInt(env.PREVIEW_PORT),
    },
  };
});
