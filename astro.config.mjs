import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'oriel9511.github.io',
  base: 'https://github.com/Oriel9511/portfolio.git',
});