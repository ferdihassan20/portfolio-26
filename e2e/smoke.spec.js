import { test, expect } from '@playwright/test';

test('home page loads without horizontal scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Ferdi Hassan/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
