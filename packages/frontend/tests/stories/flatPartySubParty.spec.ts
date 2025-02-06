import { type Page, expect, test } from '@playwright/test';
import { defaultAppURL } from '..';
import { performSearch } from './common';

test.describe('Flattened parties and subparties', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    const flattenedPartiesPage = `${defaultAppURL}&playwrightId=subparty-merged-with-party`;
    await page.goto(flattenedPartiesPage);
  });

  test('Renders correctly', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Message for Test Testesen' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Test Testesen' })).toBeVisible();
  });

  test('Party and subparty with same name are merged as one', async ({ page }) => {
    await page.getByRole('button', { name: 'Test Testesen' }).click();
    await expect(page.locator('li').filter({ hasText: 'Firma AS' }).locator('span').nth(2)).toHaveText('1');
    await expect(page.locator('li').filter({ hasText: 'Testbedrift AS' }).locator('span').nth(2)).toHaveText('2');
    await expect(page.locator('li').filter({ hasText: 'Testbedrift AS Avd Oslo' }).locator('span').nth(2)).toHaveText(
      '1',
    );

    await page.getByText('TTestbedrift AS2').click();
    await expect(page.getByRole('link', { name: 'Message for Test Testesen' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Testbedrift AS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Main party message' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sub party message' })).toBeVisible();
  });

  test('Search input shows flattened messages based on chosen party', async ({ page }) => {
    await page.getByPlaceholder('Søk').click();
    await expect(page.getByPlaceholder('Søk')).toBeVisible();

    await page.getByPlaceholder('Søk').fill('test');
    /* search box result */
    await expect(page.getByLabel('Message for Test Testesen')).toBeVisible();
    await expect(page.getByLabel('Main party message')).not.toBeVisible();
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Test Testesen' }).click();
    await page.getByText('TTestbedrift AS2').click();

    await page.getByPlaceholder('Søk').fill('party');
    await expect(page.getByLabel('Message for Test Testesen')).not.toBeVisible();
    await expect(page.getByLabel('Main party message')).toBeVisible();
    await expect(page.getByLabel('Main party message')).toBeVisible();
  });

  test('Filters shows merged parties if sub party has same name as main party', async ({ page }) => {
    await page.getByRole('button', { name: 'Test Testesen' }).click();
    await page.getByText('Alle virksomheter').click();
    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page.getByText('Mottaker').click();
    await expect(page.getByText('Til Mycompany AS Main2')).toBeVisible();
  });
});
