#!/usr/bin/env node
// Generates public/sitemap.xml from the static page list + VARA register slugs.
// Run: node scripts/gen-sitemap.mjs   (re-run whenever data/vara-register.json changes)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'https://www.futuretokenization.com';

const staticPages = [
  ['/', 'daily', '1.0'],
  ['/directory', 'weekly', '0.9'],
  ['/validate', 'weekly', '0.8'],
  ['/ecosystem', 'weekly', '0.8'],
  ['/investors', 'monthly', '0.7'],
  ['/providers', 'monthly', '0.7'],
  ['/pakistan', 'monthly', '0.7'],
  ['/privacy.html', 'yearly', '0.2'],
  ['/terms.html', 'yearly', '0.2'],
];

const register = JSON.parse(readFileSync(join(root, 'data', 'vara-register.json'), 'utf8'));
const providerPages = (register.entities || [])
  .filter((e) => e && e.slug)
  .map((e) => [`/provider/${e.slug}`, 'monthly', '0.6']);

const entry = ([path, freq, prio]) =>
  `  <url>\n    <loc>${HOST}${path}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`;

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  [...staticPages, ...providerPages].map(entry).join('\n') +
  `\n</urlset>\n`;

writeFileSync(join(root, 'public', 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${staticPages.length} static + ${providerPages.length} provider URLs`);
