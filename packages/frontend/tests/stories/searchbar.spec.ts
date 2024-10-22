import { expect, test } from '@playwright/test';
import { appURL } from '../';

test.describe('Searchbar tests', () => {
  test('test', async ({ page }) => {
    await page.goto(appURL);
    await page.getByPlaceholder('Søk i innboks').click();
    await page.getByPlaceholder('Søk i innboks').fill('penger');
    await expect(page.getByRole('link', { name: 'Arbeidsavklaringspenger Sø' })).toBeVisible();
  });
});
