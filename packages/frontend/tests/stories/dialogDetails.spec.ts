import { expect, test } from '@playwright/test';
import { appURL } from '../';

test.describe('Dialog details', () => {
  test('Checking that opening a dialog details page shows the correct number of messages', async ({ page }) => {
    await page.goto(appURL);
    await expect(page.getByRole('menuitem', { name: 'Innboks' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Innboks' }).locator('[data-color="alert"]')).toContainText('2');

    await page.getByRole('link', { name: 'Arbeidsavklaringspenger' }).click();
    await expect(page.getByRole('menuitem', { name: 'Innboks' })).toContainText('1');
  });
});
