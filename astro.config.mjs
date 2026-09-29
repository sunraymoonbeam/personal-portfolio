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
    // The Linux and Git exercise was folded back into the AI Singapore story.
    '/projects/onboarding': '/work/ai-singapore',
  },

  image: {
    // AVIF/WebP is a configured output, not an automatic consequence of
    // importing astro:assets.
    responsiveStyles: true,
  },

  build: {
    /*
     * 'always' inlined the whole stylesheet into every page, so nothing was
     * cached and the client router re-downloaded it on every navigation.
     * 'auto' emits one shared file instead: about 400 bytes worse on a cold
     * first paint, and 9 to 13 KB lighter on every page after it.
     */
    inlineStylesheets: 'auto',
  },
});
