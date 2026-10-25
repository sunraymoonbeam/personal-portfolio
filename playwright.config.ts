import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4357',
    viewport: { width: 1280, height: 900 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
    permissions: ['clipboard-read', 'clipboard-write'],
    ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4357 --ignore-lock',
    url: 'http://127.0.0.1:4357',
    reuseExistingServer: !process.env.CI,
  },
});
