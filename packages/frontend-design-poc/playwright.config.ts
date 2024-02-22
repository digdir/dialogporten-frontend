import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    locale: 'nb-NO',
    timezoneId: 'Europe/Oslo',
    trace: 'on-first-retry',
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL,
    screenshot: 'only-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
    /* TODO: Test against mobile viewports and other browser. */
  ],
  webServer: {
    command: 'pnpm dev',
    url: process.env.PLAYWRIGHT_TEST_BASE_URL,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
