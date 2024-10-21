import { expect, test } from '@playwright/test';
import { appURL } from '../';

test.describe('Global menu bar', () => {
  test('open and select Firma As', async ({ page }) => {
    await page.goto(appURL);
    await page.getByTestId('global-menu-bar-toggle-button').click();
    await expect(page.getByTestId('user-info')).toBeVisible();
    await page.getByRole('button', { name: 'Endre' }).click();
    await expect(page.getByText('Firma AS')).toBeVisible();
    await page.getByText('Firma AS').click();
    await expect(page.getByRole('button', { name: 'Firma AS' })).toBeVisible();
  });
});
