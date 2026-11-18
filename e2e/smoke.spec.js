import { test, expect } from '@playwright/test';

test('home page loads without horizontal scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Ferdi Hassan/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('hero photo is visible and fits the viewport width', async ({ page }) => {
  await page.goto('/');
  const photo = page.getByRole('img', { name: 'Portrait of Ferdi Hassan' });
  await expect(photo).toBeVisible();
  const box = await photo.boundingBox();
  const width = page.viewportSize().width;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
});
