import { expect, test } from '@playwright/test';
import { appURL } from '../';

test.describe('Sidebar menu', () => {
  test.skip('Checking all items in sidebar', async ({ page }) => {
    await page.goto(appURL);
    await page.getByRole('link', { name: 'Utkast' }).click();
    await expect(page.getByRole('heading', { name: 'utkast' })).toBeVisible();
    await page.getByRole('link', { name: 'Sendt' }).click();
    await expect(page.getByRole('heading', { name: 'sendt' })).toBeVisible();
    await page.getByRole('link', { name: 'Lagrede søk' }).click();
    await expect(page.getByText('Du har ingen lagrede søk')).toBeVisible();
    await page.getByRole('link', { name: 'Arkiv' }).click();
    await expect(page.getByRole('heading', { name: 'Ingen arkiverte meldinger' })).toBeVisible();
    await page.getByRole('link', { name: 'Papirkurv' }).click();
    await expect(page.getByRole('heading', { name: 'Ingen meldinger i papirkurv' })).toBeVisible();
    await page.getByRole('link', { name: 'Innboks' }).click();
    await expect(page.getByRole('link', { name: 'Melding om bortkjøring av sn' })).toBeVisible();
  });
});
