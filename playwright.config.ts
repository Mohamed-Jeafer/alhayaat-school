import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/compare',
  outputDir: './test-results',
  timeout: 60_000,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    trace: 'on-first-retry',
  },
  webServer: [
    {
      // Serve the Webflow HTML export statically on port 3001
      command: 'npx serve al-hayaat.webflow -p 3001 --no-clipboard',
      port: 3001,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      // Next.js dev server on port 3000
      command: 'npm run dev',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
