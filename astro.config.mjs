// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from "@astrojs/vercel";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jrcingenierosconsultores.com',
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },
  },
  adapter: vercel(),
});