/// <reference types="vite/client" />

import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";

const config: UserConfig = {
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
};

config.optimizeDeps = {
  include: [
    "@emotion/react",
    "@emotion/styled",
    "@mui/material/Unstable_Grid2",
  ],
};

if (process.env.NODE_ENV !== "production") {
  config.server = {
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(config);
