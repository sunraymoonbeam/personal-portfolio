// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://renhwa.com',
  output: 'static',
  integrations: [mdx(), sitemap()],

  // Duplicate routes must fail the build. Astro's default is "warn",
  // which would let two entries resolving to the same URL ship silently.
  prerenderConflictBehavior: 'error',

  // The page was /resume before it was /cv. Keep the old URL working.
  redirects: {
    '/resume': '/cv',
    // Work slugs dropped the start year. Old links still resolve.
    '/work/carro-2025': '/work/carro',
    '/work/ai-singapore-2024': '/work/ai-singapore',
    '/work/nie-2023': '/work/nie',
    '/work/dos-2023': '/work/dos',
    '/work/tessaract-2022': '/work/tessaract',
  },

  image: {
    // AVIF/WebP is a configured output, not an automatic consequence of
    // importing astro:assets.
    responsiveStyles: true,
  },

  build: { inlineStylesheets: 'always' },
});
