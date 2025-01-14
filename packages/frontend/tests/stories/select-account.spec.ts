import { expect, test } from '@playwright/test';
import { appURLDrafts, appURLInbox, defaultAppURL, matchPathName } from '../index';

test('should navigate to inbox when account is chosen from global menu', async ({ page }) => {
  await page.goto(defaultAppURL);
  /* click navigate to draft page */
  await page.getByRole('menuitem', { name: 'Utkast' }).click();
  expect(page.url()).toEqual(appURLDrafts);
  /* chose all organizations from the global menu */
  await page.getByRole('button', { name: 'Meny' }).click();
  await page.getByRole('menuitem', { name: 'Test Testesen Bytt konto' }).click();
  await page.getByRole('menuitem', { name: 'Alle virksomheter' }).click();

  expect(new URL(page.url()).searchParams.get('allParties')).toBe('true');
  expect(matchPathName(page.url(), appURLInbox)).toBe(true);
});
