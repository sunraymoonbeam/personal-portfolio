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

  image: {
    // AVIF/WebP is a configured output, not an automatic consequence of
    // importing astro:assets.
    responsiveStyles: true,
  },

  build: { inlineStylesheets: 'always' },
});
