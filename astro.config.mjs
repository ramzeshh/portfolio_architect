// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dev-stage: this sandbox repo (project page).
// At transfer (D10): site -> 'https://<roman-login>.github.io', base -> '/'.
export default defineConfig({
  site: 'https://ramzeshh.github.io',
  base: '/portfolio_architect',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
