import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { appURL } from '..';

test.describe('Axe test', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto(appURL);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
