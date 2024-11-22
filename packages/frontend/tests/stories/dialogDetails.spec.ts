import { expect, test } from '@playwright/test';
import { appURL } from '../';

test.describe('Dialog details', () => {
  test.skip('Checking that opening a dialog details page shows the correct number of messages', async ({ page }) => {
    await page.goto(appURL);
    await expect(page.getByRole('link', { name: 'Innboks' })).toBeVisible();
    await expect(page.getByTestId('sidebar').getByRole('list')).toContainText('2');
    await page.getByRole('link', { name: 'Arbeidsavklaringspenger' }).click();
    await expect(page.getByTestId('sidebar').getByRole('list')).toContainText('1');
  });
});
