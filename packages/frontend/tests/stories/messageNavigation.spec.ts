import { expect, test } from '@playwright/test';
import { appURL } from '../';

test.describe('Message navigation', () => {
  const pageWithMockOrganizations = `${appURL}&playwrightId=login-party-context`;

  test('Back button navigates correctly and saves party', async ({ page }) => {
    await page.goto(pageWithMockOrganizations);

    await expect(page.getByRole('button', { name: 'Test Testesen' })).toBeVisible();
    await expect(page.getByTestId('pageLayout-background')).not.toHaveClass(/.*isCompany.*/);
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();
    await page.getByRole('link', { name: 'Skatten din for 2022' }).click();
    await page.getByRole('button', { name: 'Tilbake' }).click();
    await expect(page.getByRole('button', { name: 'Test Testesen' })).toBeVisible();

    await page.getByRole('button', { name: 'Test Testesen' }).click();
    await page.locator('li').filter({ hasText: 'Firma AS' }).click();

    await expect(page.getByRole('button', { name: 'Firma AS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'This is a message 1 for Firma AS' })).toBeVisible();
    await page.getByRole('link', { name: 'This is a message 1 for Firma AS' }).click();
    await page.getByRole('button', { name: 'Tilbake' }).click();
    await expect(page.getByRole('button', { name: 'Firma AS' })).toBeVisible();
    await expect(page.getByTestId('pageLayout-background')).toHaveClass(/.*isCompany.*/);
    expect(new URL(page.url()).searchParams.has('party')).toBe(true);

    await page.getByRole('button', { name: 'Firma AS' }).click();
    await page.locator('li').filter({ hasText: 'Alle virksomheter' }).click();
    await expect(page.getByRole('button', { name: 'Alle virksomheter' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'This is a message 1 for Firma AS' })).toBeVisible();
    await page.getByRole('link', { name: 'This is a message 1 for Firma AS' }).click();
    await page.getByRole('button', { name: 'Tilbake' }).click();
    await expect(page.getByRole('button', { name: 'Alle virksomheter' })).toBeVisible();
    await expect(page.getByTestId('pageLayout-background')).toHaveClass(/.*isCompany.*/);
  });

  test('Back button navigates to previous page the message has been opened from', async ({ page }) => {
    await page.goto(pageWithMockOrganizations);

    await expect(page.locator('h2').filter({ hasText: /^Skatten din for 2022$/ })).toBeVisible();
    await page.getByRole('link', { name: 'Skatten din for 2022' }).click();
    await page.getByRole('button', { name: 'Flytt til papirkurv' }).click();

    await page.getByRole('link', { name: 'Papirkurv' }).click();
    await page.getByRole('link', { name: 'Skatten din for 2022' }).click();
    await page.getByRole('button', { name: 'Tilbake' }).click();
    await expect(page.getByRole('heading', { name: 'i papirkurv' })).toBeVisible();
  });
});
