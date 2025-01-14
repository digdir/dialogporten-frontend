import { type Page, expect, test } from '@playwright/test';
import { defaultAppURL } from '..';
import { MOCKED_SYS_DATE } from '../../src/mocks/data/stories/date-2024/dialogs';

test.describe('Date filter, system date set 2024', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    const dateScenarioPage = `${defaultAppURL}&playwrightId=date-2024`;
    //mock system date to keep tests consistent
    await page.clock.setFixedTime(MOCKED_SYS_DATE);
    await page.goto(dateScenarioPage);
  });

  test('Dialog with mocked system date and scenario data visable', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Mocked system date Dec 31, 2024' })).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'Melding om bortkjøring av snø i 2024 Oslo kommune til Test Testesen Melding om',
      }),
    ).toBeVisible();
  });

  test('Date filter - date picker functionality', async ({ page }) => {
    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await expect(page.getByText('Oppdatert dato')).toBeVisible();

    await page.getByText('Oppdatert dato').click();

    await expect(page.getByText('Spesifer dato')).toBeVisible();
    await page.getByText('Spesifer dato').click();

    await expect(page.getByTestId('filterButton-fromDate')).toBeVisible();
    await expect(page.getByTestId('filterButton-toDate')).toBeVisible();

    await expect(page.getByTestId('filterButton-fromDate')).toHaveValue('2022-02-20');
    await expect(page.getByTestId('filterButton-toDate')).toHaveValue('2024-12-31');

    await page.getByTestId('filterButton-fromDate').fill('2023-01-01');
    await page.getByTestId('filterButton-toDate').fill('2023-12-31');
    await page.getByRole('button', { name: 'Bruk dato' }).click();

    await expect(page.getByRole('link', { name: 'Mocked system date des 31, 2024' })).not.toBeVisible();
  });

  test('Date filter - quick filters functionality', async ({ page }) => {
    await page.getByRole('button', { name: 'Legg til filter' }).click();

    await expect(page.getByText('Oppdatert dato')).toBeVisible();
    await page.getByText('Oppdatert dato').click();

    await expect(page.getByText('I dag')).toBeVisible();
    await expect(page.locator('li').filter({ hasText: 'I dag' }).locator('span').nth(2)).toHaveText('1');

    await expect(page.getByText('Denne måneden')).toBeVisible();
    await expect(page.locator('li').filter({ hasText: 'Denne måneden' }).locator('span').nth(2)).toHaveText('1');

    await expect(page.getByText('I år')).toBeVisible();
    await expect(page.locator('li').filter({ hasText: 'I år' }).locator('span').nth(2)).toHaveText('3');

    await page.getByText('I dag').click();
    await expect(page.getByRole('button', { name: 'I dag' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Mocked system date Dec 31, 2024' })).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'Melding om bortkjøring av snø i 2024 Oslo kommune til Test Testesen Melding om',
      }),
    ).not.toBeVisible();
  });
});
