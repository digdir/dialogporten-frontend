import { type Page, expect, test } from '@playwright/test';
import { appURL } from '../';

test.describe('InboxItemPage', () => {
  test('Check message opening, archiving and deleting', async ({ page }: { page: Page }) => {
    const arkivLink = page.getByRole('link', { name: 'Arkiv' });
    const arkivLinkCount = arkivLink.locator('div > div > span');

    const papirkurvLink = page.getByRole('link', { name: 'Papirkurv' });
    const papirkurvLinkCount = papirkurvLink.locator('span');

    await page.goto(appURL);
    await expect(page.locator('h2').filter({ hasText: /^Skatten din for 2022$/ })).toBeVisible();
    await page.getByRole('link', { name: 'Skatten din for 2022' }).click();

    await page
      .locator('h2')
      .filter({ hasText: /^Grunnleggende konsepter fra markdown$/ })
      .waitFor();
    await expect(page.locator('h2').filter({ hasText: /^Grunnleggende konsepter fra markdown$/ })).toBeVisible();

    await page.getByRole('button', { name: 'Flytt til arkiv' }).click();
    await page.locator('span').filter({ hasText: /^Flyttet til arkiv$/ });
    await expect(arkivLinkCount).toHaveText('1');

    await arkivLink.click();
    await expect(page.getByRole('heading', { name: 'arkivert' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();

    await page.getByRole('link', { name: 'Skatten din for 2022' }).click();
    await page.getByRole('button', { name: 'Flytt til papirkurv' }).click();
    await page.locator('span').filter({ hasText: /^Flyttet til papirkurv$/ });
    await expect(arkivLinkCount).not.toBeVisible();
    await expect(papirkurvLinkCount).toHaveText('1');

    await papirkurvLink.click();
    await expect(page.getByRole('heading', { name: '1 i papirkurv' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Skatten din for 2022' })).toBeVisible();

    await arkivLink.click();
    await expect(page.getByRole('heading', { name: 'Ingen arkiverte meldinger' })).toBeVisible();
  });
});
