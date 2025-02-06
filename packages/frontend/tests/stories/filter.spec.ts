import { expect, test } from '@playwright/test';
import { defaultAppURL } from '../';
import { PageRoutes } from '../../src/pages/routes';
import { getSidebarMenuItem } from './common';

test.describe('Testing filter bar', () => {
  test('should filter when selecting sender filter and status filter', async ({ page }) => {
    await page.goto(defaultAppURL);

    /* Choose Skatteetaten as sender */
    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page.getByText('Avsender').click();
    await page.getByLabel('Fra Skatteetaten').check();
    await page.mouse.click(200, 0, { button: 'left' });

    expect(new URL(page.url()).searchParams.get('sender')).toEqual('Skatteetaten');
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();

    /* Remove filter */
    await page
      .locator('div')
      .filter({ hasText: /^Fra Skatteetaten Legg til filter$/ })
      .getByRole('button')
      .nth(1)
      .click();

    expect(new URL(page.url()).searchParams.has('sender')).toEqual(false);

    /* Choose COMPLETED as status */
    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Status$/ })
      .nth(1)
      .click();
    await page.getByText('Avsluttet').first().click();

    expect(new URL(page.url()).searchParams.get('status')).toEqual('COMPLETED');

    await page.mouse.click(200, 0, { button: 'left' });
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Søknad om personlig bilskilt' })).toBeVisible();
  });

  test('should remove filters when changing view types', async ({ page }) => {
    await page.goto(defaultAppURL);

    /* Choose Skatteetaten as sender */
    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page.getByText('Avsender').click();
    await page.getByLabel('Fra Skatteetaten').check();
    await page.mouse.click(200, 0, { button: 'left' });

    expect(new URL(page.url()).searchParams.get('sender')).toEqual('Skatteetaten');
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();

    /* Change view type */
    await getSidebarMenuItem(page, PageRoutes.drafts).click();

    expect(new URL(page.url()).searchParams.has('sender')).toEqual(false);
  });

  test('should keep filters when returning to a filtered inbox from ', async ({ page }) => {
    await page.goto(defaultAppURL);

    /* Choose Skatteetaten as sender */
    await page.getByRole('button', { name: 'Legg til filter' }).click();
    await page.getByText('Avsender').click();
    await page.getByLabel('Fra Skatteetaten').check();
    await page.mouse.click(200, 0, { button: 'left' });

    expect(new URL(page.url()).searchParams.get('sender')).toEqual('Skatteetaten');

    await page.getByRole('link', { name: 'Skatten din for 2022' }).click();

    await page.getByRole('button', { name: 'Tilbake' }).click();

    expect(new URL(page.url()).searchParams.get('sender')).toEqual('Skatteetaten');
  });
});
