import { expect, test } from '@playwright/test';
import { defaultAppURL } from '../';

test.describe('Saved search', () => {
  test('Create and deletesaved search', async ({ page }) => {
    await page.goto(defaultAppURL);
    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page.getByText('Avsender').click();
    await page.getByLabel('Fra Oslo kommune').check();
    await page.mouse.click(200, 0, { button: 'left' });
    await page.getByRole('button', { name: 'Lagre søk' }).click();

    await expect(page.getByRole('menuitem', { name: 'Lagrede søk' }).locator('span span:has-text("1")')).toContainText(
      '1',
    );
    await page.getByRole('menuitem', { name: 'Lagrede søk' }).click();
    await expect(page.getByRole('main')).toContainText('1 lagret søk');

    await expect(page.locator('header').filter({ hasText: 'Oslo kommune' })).toBeVisible();
    await page.locator('header').filter({ hasText: 'Oslo kommune' }).getByRole('button').click();

    await page.getByText('Slett').click();
    await expect(page.getByRole('main')).toContainText('Du har ingen lagrede søk');
  });

  test('Saved search based on searchbar value', async ({ page }) => {
    await page.goto(defaultAppURL);
    await page.getByPlaceholder('Søk').click();
    await expect(page.getByPlaceholder('Søk')).toBeVisible();
    await page.getByPlaceholder('Søk').fill('skatten');
    await page.getByPlaceholder('Søk').press('Enter');
    await page.getByRole('button', { name: 'Lagre søk' }).click();
    await expect(page.getByRole('button', { name: 'Lagret søk' })).toBeVisible();

    await expect(page.getByRole('menuitem', { name: 'Lagrede søk' }).locator('span span:has-text("1")')).toContainText(
      '1',
    );

    await page.getByPlaceholder('Søk').click();
    await page.getByPlaceholder('Søk').fill('skatten din');
    await page.getByPlaceholder('Søk').press('Enter');
    await expect(page.getByRole('button', { name: 'Lagret søk' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Lagre søk' })).toBeVisible();
  });

  test('Saved search link shows correct result', async ({ page }) => {
    await page.goto(defaultAppURL);

    await page.getByRole('button', { name: 'Test Testesen' }).click();
    await page.getByText('Testbedrift AS Avd Oslo').click();
    await expect(page.getByTestId('pageLayout-background')).toHaveClass(/.*isCompany.*/);
    await expect(page.getByRole('link', { name: 'Innkalling til sesjon' })).toBeVisible();

    await page.getByPlaceholder('Søk').click();
    await expect(page.getByPlaceholder('Søk')).toBeVisible();
    await page.getByPlaceholder('Søk').fill('innkalling');
    await page.getByPlaceholder('Søk').press('Enter');

    await page.getByRole('button', { name: 'Lagre søk' }).click();
    await page.getByRole('menuitem', { name: 'Lagrede søk' }).click();

    await expect(page.getByRole('link', { name: '«innkalling»' })).toBeVisible();

    await page.getByRole('link', { name: '«innkalling»' }).click();
    await expect(page.getByRole('link', { name: 'Innkalling til sesjon' })).toBeVisible();
    await expect(page.getByTestId('pageLayout-background')).toHaveClass(/.*isCompany.*/);
  });
});
