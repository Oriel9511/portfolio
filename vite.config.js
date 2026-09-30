/* global process */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  // Served from https://oriel9511.github.io/portfolio/
  base: '/portfolio/',
  plugins: [
    react(),
    vitePrerenderPlugin({
      renderTarget: '#root',
      prerenderScript: resolve(__dirname, 'src/prerender.jsx'),
    }),
    {
      name: 'force-exit',
      apply: 'build',
      closeBundle() {
        process.exit(0);
      },
    },
  ],
});
