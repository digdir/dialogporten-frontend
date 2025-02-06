import { type Page, expect } from '@playwright/test';

export const getSidebar = (page: Page) => page.locator('aside');
export const getSidebarMenuItem = (page: Page, route: string) => getSidebar(page).locator(`li a[href^="${route}?"]`);
export const getSidebarMenuItemBadge = (page: Page, route: string) =>
  getSidebarMenuItem(page, route).locator('div > span + span + span');

export async function performSearch(page, query: string, action?: 'clear' | 'click' | 'enter') {
  const endGameAction = action || 'click';
  await page.getByPlaceholder('Søk').click();
  await expect(page.getByPlaceholder('Søk')).toBeVisible();
  await page.getByPlaceholder('Søk').fill(query);
  if (endGameAction === 'clear') {
    await page.getByTestId('search-button-clear').click();
  } else if (endGameAction === 'click') {
    await page.getByRole('button', { name: new RegExp(`«${query}» i innboks`) }).click();
  } else if (endGameAction === 'enter') {
    await page.getByRole('button', { name: new RegExp(`«${query}» i innboks`) }).hover();
    await page.keyboard.press('Enter');
  }
}

export async function selectDialogBySearch(page, query: string, itemLabel: string, action?: 'click' | 'enter') {
  const endGameAction = action || 'click';
  await page.getByPlaceholder('Søk').click();
  await expect(page.getByPlaceholder('Søk')).toBeVisible();
  await page.getByPlaceholder('Søk').fill(query);

  if (endGameAction === 'click') {
    await page.getByLabel(itemLabel).click();
  } else if (endGameAction === 'enter') {
    await page.getByLabel(itemLabel).hover();
    await page.keyboard.press('Enter');
  }
}
