import { expect, test } from '@playwright/test';
import { defaultAppURL } from '../';
import { PageRoutes } from '../../src/pages/routes';
import { getSidebarMenuItem, getSidebarMenuItemBadge, performSearch } from './common';

test.describe('Saved search', () => {
  test('Create and delete saved search', async ({ page }) => {
    await page.goto(defaultAppURL);
    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page.getByText('Avsender').click();
    await page.getByLabel('Fra Oslo kommune').check();
    await page.mouse.click(200, 0, { button: 'left' });

    await page.getByRole('button', { name: 'Lagre søk' }).click();
    await expect(page.getByText('Søk lagret')).toBeVisible();

    await expect(getSidebarMenuItemBadge(page, PageRoutes.savedSearches)).toContainText('1');

    await getSidebarMenuItem(page, PageRoutes.savedSearches).click();
    await expect(page.getByRole('main')).toContainText('1 lagret søk');

    await expect(page.locator('header').filter({ hasText: 'Oslo kommune' })).toBeVisible();
    await page.locator('header').filter({ hasText: 'Oslo kommune' }).getByRole('button').click();

    await page.getByText('Slett').click();
    await expect(page.getByText('Søk slettet')).toBeVisible();
    await expect(page.getByRole('main')).toContainText('Du har ingen lagrede søk');
  });

  test('Saved search based on searchbar value', async ({ page }) => {
    await page.goto(defaultAppURL);

    await performSearch(page, 'skatten');

    await page.getByRole('button', { name: 'Lagre søk' }).click();
    await expect(page.getByRole('button', { name: 'Lagret søk' })).toBeVisible();

    await expect(getSidebarMenuItemBadge(page, PageRoutes.savedSearches)).toContainText('1');

    await performSearch(page, 'skatten din');

    await expect(page.getByRole('button', { name: 'Lagret søk' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Lagre søk' })).toBeVisible();
  });

  test('Saved search link shows correct result', async ({ page }) => {
    await page.goto(defaultAppURL);

    await page.getByRole('button', { name: 'Test Testesen' }).click();
    await page.getByText('Testbedrift AS Avd Oslo').click();
    await expect(page.getByTestId('pageLayout-background')).toHaveClass(/.*isCompany.*/);
    await expect(page.getByRole('link', { name: 'Innkalling til sesjon' })).toBeVisible();

    await performSearch(page, 'innkalling');

    await page.getByRole('button', { name: 'Lagre søk' }).click();

    await getSidebarMenuItem(page, PageRoutes.savedSearches).click();

    await expect(page.getByRole('link', { name: '«innkalling»' })).toBeVisible();

    await page.getByRole('link', { name: '«innkalling»' }).click();
    await expect(page.getByRole('link', { name: 'Innkalling til sesjon' })).toBeVisible();
    await expect(page.getByTestId('pageLayout-background')).toHaveClass(/.*isCompany.*/);
  });
});
