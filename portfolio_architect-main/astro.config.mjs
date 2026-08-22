// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { load } from 'js-yaml';

// Single source of truth for the address: `domain` in content/site.yaml.
// The custom domain serves the site at the root, so no `base` is needed
// even though this is a project repo (CNAME is emitted by
// src/pages/CNAME.ts from the same value).
const raw = /** @type {{ domain?: string }} */ (
  load(readFileSync(new URL('content/site.yaml', import.meta.url), 'utf-8'))
);
// edited by hand in the GitHub web UI: tolerate a pasted scheme or slash
const domain = (raw.domain ?? '').trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
if (!domain) throw new Error('content/site.yaml: `domain` is empty');

export default defineConfig({
  site: `https://${domain}`,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
