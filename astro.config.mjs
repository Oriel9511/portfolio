import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  // site: 'https://Oriel9511.github.io',
  // base: '/',
  build: {
    outDir: 'dist', // Carpeta de salida
    assets: 'public', // Carpeta de recursos públicos
  },
  vite: {
    buildEnd: async () => {
      await fs.copy('public', 'dist/public');
    }
  }
});
