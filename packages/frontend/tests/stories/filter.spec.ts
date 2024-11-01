import { expect, test } from '@playwright/test';
import { appURL } from '../';

test.describe('Testing filter bar', () => {
  test('Selecting Avsender filter and status filter', async ({ page }) => {
    await page.goto(appURL);
    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page.getByText('Avsender').click();
    await page.getByLabel('Fra Skatteetaten').check();
    await page.mouse.click(200, 0, { button: 'left' });
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();
    await page
      .locator('div')
      .filter({ hasText: /^Fra Skatteetaten Legg til filter$/ })
      .getByRole('button')
      .nth(1)
      .click();
    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Status$/ })
      .nth(1)
      .click();
    await page.getByText('Avsluttet').first().click();
    await page.mouse.click(200, 0, { button: 'left' });
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Søknad om personlig bilskilt' })).toBeVisible();
  });
});
