import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173/');
});
test.describe('Smoke test', () => {
  test('should show header, aside, main and footer', async ({ page }) => {
    const main = page.locator('main');
    const aside = page.locator('[data-testid="sidebar"]');
    const footer = page.locator('[data-testid="main-footer"]');
    const header = page.locator('[data-testid="main-header"]');

    await expect(main).toBeVisible();
    await expect(aside).toBeVisible();
    await expect(footer).toBeVisible();
    await expect(header).toBeVisible();
  });
});
