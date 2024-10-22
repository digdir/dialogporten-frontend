import { expect, test } from '@playwright/test';

test.describe('IDPorten integration', () => {
  test('test', async ({ page }) => {
    await page.goto('https://af.at.altinn.cloud');
    await page.getByRole('link', { name: 'TestID Lag din egen' }).click();
    await page.getByLabel('Personidentifikator (').click();
    await page.getByLabel('Personidentifikator (').fill('14886498226');
    await page.getByRole('button', { name: 'Autentiser' }).click();
    await page.getByRole('button', { name: 'Hjelpelinje Ordinær' }).click();
    await expect(page.locator('span').filter({ hasText: /^Hjelpelinje Ordinær$/ })).toBeVisible();
  });
});
