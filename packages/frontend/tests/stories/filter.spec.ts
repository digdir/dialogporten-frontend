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

  test('No results displaying correct message and filters', async ({ page }) => {
    await page.goto(appURL);
    await expect(page.getByText('Skatten din for 2022')).toBeVisible();

    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page.getByText('Avsender').click();
    await page.getByLabel('Fra Oslo kommune').check();
    await page.mouse.click(200, 0, { button: 'left' });

    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page.getByText('Status').click();
    await page.getByLabel('Nye').check();
    await page.mouse.click(200, 0, { button: 'left' });

    const avsenderFilterRemoveBtn = page
      .getByRole('button', { name: 'Fra Oslo kommune' })
      .locator('..')
      .locator('button')
      .nth(1);
    const statusFilterRemoveBtn = page.getByRole('button', { name: 'Nye' }).locator('..').locator('button').nth(1);

    await expect(page.getByText('Ingen meldinger funnet med valgte filtrene')).toBeVisible();
    await expect(page.getByText('Skatten din for 2022')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Fra Oslo kommune' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Nye' })).toBeVisible();

    await avsenderFilterRemoveBtn.click();
    await statusFilterRemoveBtn.click();

    await expect(page.getByText('Skatten din for 2022')).toBeVisible();
  });
});
