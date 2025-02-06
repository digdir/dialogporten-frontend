import { expect, test } from '@playwright/test';
import { defaultAppURL } from '../';
import { PageRoutes } from '../../src/pages/routes';
import { getSidebarMenuItem } from './common';

test.describe('Dialog details', () => {
  test('Checking that opening a dialog details page shows the correct number of messages', async ({ page }) => {
    await page.goto(defaultAppURL);
    await expect(getSidebarMenuItem(page, PageRoutes.inbox)).toBeVisible();
    await expect(getSidebarMenuItem(page, PageRoutes.inbox).locator('[data-color="alert"]')).toContainText('2');

    await page.getByRole('link', { name: 'Arbeidsavklaringspenger' }).click();
    await expect(getSidebarMenuItem(page, PageRoutes.inbox)).toContainText('1');
  });
});
