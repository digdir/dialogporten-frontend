import { expect, test } from '@playwright/test';
import { appURL } from '../';

test.describe('Saved search', () => {
  test('Create and deletesaved search', async ({ page }) => {
    await page.goto(appURL);
    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page.getByText('Avsender').click();
    await page.getByLabel('Fra Oslo kommune').check();
    await page.mouse.click(200, 0, { button: 'left' });
    await page.getByRole('button', { name: 'Lagre søk' }).click();
    await expect(page.getByTestId('sidebar').getByRole('list')).toContainText('1');
    await page.getByRole('link', { name: 'Lagrede søk' }).click();
    await expect(page.getByRole('main')).toContainText('1 lagret søk');
    await page.locator('section').filter({ hasText: '1 lagret søkI Innboks: Oslo' }).getByRole('button').click();
    await page.getByText('Slett').click();
    await page.getByRole('button', { name: 'Ja, forsett' }).click();
    await expect(page.getByRole('main')).toContainText('Du har ingen lagrede søk');
  });
});
