import { AxeBuilder } from '@axe-core/playwright';
import { type Page, expect, test } from '@playwright/test';
import { defaultAppURL } from '..';

const WCAG_TAGS_CONFIG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const VIOLATION_FILTERS = ['critical', 'serious'];
const expectWithFilterViolations = (violations) => {
  const filteredViolations = violations.filter((violation) => VIOLATION_FILTERS.includes(violation.impact));
  expect(filteredViolations).toEqual([]);
};

const testAccessibility = async (page: Page, url: string) => {
  await page.goto(url);
  const accessibilityScanResults = await new AxeBuilder({ page }).withTags(WCAG_TAGS_CONFIG).analyze();

  expectWithFilterViolations(accessibilityScanResults.violations);
};

test.describe('Axe test', () => {
  const testCases = [
    { name: 'Inbox', path: '' },
    { name: 'Drafts', path: '/drafts' },
    { name: 'Sent', path: '/sent' },
    { name: 'Archive', path: '/archive' },
    { name: 'Bin', path: '/bin' },
  ];

  for (const { name, path } of testCases) {
    test(`${name} - should not have any automatically detectable accessibility issues`, async ({ page }) => {
      await testAccessibility(page, `${defaultAppURL}${path}`);
    });
  }
});
