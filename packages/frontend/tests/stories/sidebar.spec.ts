import { expect, test } from '@playwright/test';
import { defaultAppURL } from '../';
import { PageRoutes } from '../../src/pages/routes';
import { getSidebarMenuItem } from './common';

test.describe('Sidebar menu', () => {
  test('Checking all items in sidebar', async ({ page }) => {
    await page.goto(defaultAppURL);
    await getSidebarMenuItem(page, PageRoutes.drafts).click();
    await expect(page.getByRole('heading', { name: 'utkast' })).toBeVisible();

    await getSidebarMenuItem(page, PageRoutes.sent).click();
    await expect(page.getByRole('heading', { name: 'sendt' })).toBeVisible();

    await getSidebarMenuItem(page, PageRoutes.savedSearches).click();
    await expect(page.getByText('Du har ingen lagrede søk')).toBeVisible();

    await getSidebarMenuItem(page, PageRoutes.archive).click();
    await expect(page.getByRole('heading', { name: 'Ingen arkiverte meldinger' })).toBeVisible();

    await getSidebarMenuItem(page, PageRoutes.bin).click();
    await expect(page.getByRole('heading', { name: 'Ingen meldinger i papirkurv' })).toBeVisible();

    await getSidebarMenuItem(page, PageRoutes.inbox).click();
    await expect(page.getByRole('link', { name: 'Melding om bortkjøring av sn' })).toBeVisible();
  });
});
