/// <reference types="vite/client" />

import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

const config: UserConfig = {
    plugins: [react()]
};

if (process.env.NODE_ENV !== "production") {
    config.server = {
        proxy: {
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
            }
        }
    }
}


// https://vitejs.dev/config/
export default defineConfig(config);
