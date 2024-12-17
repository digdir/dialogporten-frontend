import { type Page, expect, test } from '@playwright/test';
import { appURL } from '../';

test.describe('LoginPartyContext', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    const dateScenarioPage = `${appURL}&playwrightId=login-party-context`;
    await page.goto(dateScenarioPage);
  });

  test('Correct messages for selected party', async ({ page }: { page: Page }) => {
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Test Testesen' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'This is a message 1 for Firma AS' })).not.toBeVisible();
    expect(new URL(page.url()).searchParams.has('party')).toBe(false);
    expect(new URL(page.url()).searchParams.has('allParties')).toBe(false);

    await page.getByRole('button', { name: 'Test Testesen' }).click();
    await expect(page.locator('li').filter({ hasText: 'Firma AS' }).locator('span').nth(2)).toHaveText('1');
    await expect(page.getByText('Alle virksomheter')).toBeVisible();
    await expect(page.locator('li').filter({ hasText: 'Testbedrift AS' }).locator('span').nth(2)).toHaveText('1');
    await expect(page.locator('li').filter({ hasText: 'Testbedrift AS Avd Sub' }).locator('span').nth(2)).toHaveText(
      '2',
    );
    await expect(page.locator('li').filter({ hasText: 'Testbedrift AS Avd Oslo' }).locator('span').nth(2)).toHaveText(
      '1',
    );

    await page.locator('li').filter({ hasText: 'Firma AS' }).click();
    await expect(page.getByRole('button', { name: 'Firma AS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'This is a message 1 for Firma AS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).not.toBeVisible();
    expect(new URL(page.url()).searchParams.has('party')).toBe(true);
    expect(new URL(page.url()).searchParams.has('allParties')).toBe(false);

    await page.getByRole('button', { name: 'Firma AS' }).click();
    await page.getByText('TTestbedrift AS Avd Sub2').click();
    await expect(page.getByRole('button', { name: 'Testbedrift AS Avd Sub' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'This is a message 1 for Firma AS' })).not.toBeVisible();
    await expect(
      page.getByRole('link', { name: 'This is a message 1 for Testbedrift AS sub party AVD SUB' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'This is a message 2 for Testbedrift AS sub party AVD SUB' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Testbedrift AS Avd Sub' }).click();
    await page.getByText('Alle virksomheter').click();
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'This is a message 1 for Firma AS' })).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'This is a message 1 for Testbedrift AS Oslo kommune til Testbedrift AS Message',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'This is a message 1 for Testbedrift AS sub party AVD SUB' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'This is a message 2 for Testbedrift AS sub party AVD SUB' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Innkalling til sesjon' })).toBeVisible();

    expect(new URL(page.url()).searchParams.has('party')).toBe(true);
    expect(new URL(page.url()).searchParams.has('allParties')).toBe(true);
    expect(new URL(page.url()).searchParams.get('allParties')).toBe('true');

    await page.reload();
    expect(new URL(page.url()).searchParams.has('party')).toBe(true);
    expect(new URL(page.url()).searchParams.has('allParties')).toBe(true);
    expect(new URL(page.url()).searchParams.get('allParties')).toBe('true');
  });

  test('Correct colour theme for selected party', async ({ page }: { page: Page }) => {
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Test Testesen' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'This is a message 1 for Firma AS' })).not.toBeVisible();

    await expect(page.getByTestId('pageLayout-background')).not.toHaveClass(/.*isCompany.*/);

    await page.getByRole('button', { name: 'Test Testesen' }).click();
    await page.locator('li').filter({ hasText: 'Firma AS' }).click();
    await expect(page.getByRole('button', { name: 'Firma AS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'This is a message 1 for Firma AS' })).toBeVisible();

    await expect(page.getByTestId('pageLayout-background')).toHaveClass(/.*isCompany.*/);
    await expect(page.getByRole('button', { name: 'Firma AS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'This is a message 1 for Firma AS' })).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('pageLayout-background')).toHaveClass(/.*isCompany.*/);
    await expect(page.getByRole('button', { name: 'Firma AS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'This is a message 1 for Firma AS' })).toBeVisible();
  });

  test('Searchbar input adds search params', async ({ page }: { page: Page }) => {
    expect(new URL(page.url()).searchParams.has('search')).toBe(false);
    await page.getByPlaceholder('Søk').click();
    await expect(page.getByPlaceholder('Søk')).toBeVisible();
    await page.getByPlaceholder('Søk').fill('skatten din');
    await page.getByPlaceholder('Søk').press('Enter');
    const searchParams = new URL(page.url()).searchParams;
    expect(searchParams.has('search')).toBe(true);
    expect(searchParams.get('search')).toBe('skatten din');

    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Melding om bortkjøring av snø' })).not.toBeVisible();

    //TO-DO Fix updating messages based on search params (reload and go-back btn) #1559
    await page.reload();
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Melding om bortkjøring av snø' })).not.toBeVisible();
  });

  test('Go-back button deletes search bar value', async ({ page }: { page: Page }) => {
    await page.getByPlaceholder('Søk').click();
    await expect(page.getByPlaceholder('Søk')).toBeVisible();
    await page.getByPlaceholder('Søk').fill('skatten din');
    await page.getByPlaceholder('Søk').press('Enter');

    let searchParams = new URL(page.url()).searchParams;
    expect(searchParams.has('search')).toBe(true);
    expect(searchParams.get('search')).toBe('skatten din');
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Melding om bortkjøring av snø' })).not.toBeVisible();

    //TO-DO Fix updating messages based on search params (reload and go-back btn) #1559
    await page.goBack();
    searchParams = new URL(page.url()).searchParams;
    expect(searchParams.has('search')).toBe(false);
    await expect(page.getByPlaceholder('Søk')).toBeEmpty();
    await expect(page.getByRole('link', { name: 'Melding om bortkjøring av snø' })).toBeVisible();
  });
});
