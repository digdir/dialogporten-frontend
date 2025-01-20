import { expect, test } from '@playwright/test';
import { baseQueryParams, baseURL, defaultAppURL } from '..';
import { firstMsgId } from '../../src/mocks/data/stories/search-flow/dialogs';

test.describe('Search flow', () => {
  test('less than 3 chars not allowed', async ({ page }) => {
    await page.goto(`${defaultAppURL}&playwrightId=search-flow`);
    await page.getByPlaceholder('Søk').click();
    await page.getByPlaceholder('Søk').fill('me');
    await expect(page.getByRole('heading', { name: 'Anbefalte treff' })).not.toBeVisible();
    await page.getByTestId('search-button-clear').click();
    await page.getByPlaceholder('Søk').click();
    await page.getByPlaceholder('Søk').fill('mel');
    await expect(page.getByRole('heading', { name: 'Anbefalte treff' })).toBeVisible();
    await expect(page.getByRole('button', { name: '«mel» i innboks 3 treff' })).toBeVisible();
  });

  test('Badge with number of msgs and (5) visible suggestions', async ({ page }) => {
    await page.goto(`${defaultAppURL}&playwrightId=search-flow`);
    await page.getByPlaceholder('Søk').click();
    await page.getByPlaceholder('Søk').fill('Sixth');
    await expect(page.getByRole('button', { name: '«Sixth» i innboks 1 treff' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sixth test message Sixth' })).toBeVisible();
    await page.getByTestId('search-button-clear').click();
    await page.getByPlaceholder('Søk').click();
    await page.getByPlaceholder('Søk').fill('test');
    await expect(page.getByRole('button', { name: '«test» i innboks 6 treff' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'First test message First test' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Second test message Second' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Third test message Third test' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Fourth test message Fourth' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Fifth test message Fifth test' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sixth test message Sixth' })).not.toBeVisible();
  });

  test('Search link should open message with enter', async ({ page }) => {
    await page.goto(`${defaultAppURL}&playwrightId=search-flow`);
    await page.getByPlaceholder('Søk').click();
    await page.getByPlaceholder('Søk').fill('Sixth');
    await page.getByRole('link', { name: 'Sixth test message Sixth' }).hover();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Sixth test message' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Info i markdown' })).toBeVisible();
  });

  test('Search link should open message with click', async ({ page }) => {
    await page.goto(`${defaultAppURL}&playwrightId=search-flow`);
    await page.getByPlaceholder('Søk').click();
    await page.getByPlaceholder('Søk').fill('Sixth');
    await page.getByRole('link', { name: 'Sixth test message Sixth' }).click();
    await expect(page.getByRole('heading', { name: 'Sixth test message' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Info i markdown' })).toBeVisible();
  });

  test('Navigating from message should go to inbox', async ({ page }) => {
    await page.goto(`${baseURL}/inbox/${firstMsgId}/${baseQueryParams}&playwrightId=search-flow`);

    await page.getByRole('button', { name: 'Tilbake' }).click();
    await expect(page).toHaveURL(`${defaultAppURL}&playwrightId=search-flow`);
  });
});
