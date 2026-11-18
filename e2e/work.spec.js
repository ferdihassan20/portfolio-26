import { test, expect } from '@playwright/test';

async function openConsumerCase(page) {
  await page.goto('/#work');
  await page.getByRole('heading', { name: 'Consumer Strategy Lab', level: 3 }).click();
  return page.getByRole('dialog', { name: /Consumer Strategy Lab/ });
}

test('card opens the popup with the PDF', async ({ page }) => {
  const dialog = await openConsumerCase(page);
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.pdf-page[data-page-number="1"] canvas')).toBeVisible({ timeout: 30_000 });
});

test('VIEW FULL CASE goes to the detail page and leaves it scrollable', async ({ page }) => {
  const dialog = await openConsumerCase(page);
  await dialog.getByRole('link', { name: 'VIEW FULL CASE →' }).click();
  await expect(page).toHaveURL(/\/work\/consumer-strategy$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('popup fits the viewport width', async ({ page }) => {
  const dialog = await openConsumerCase(page);
  const box = await dialog.locator('.project-modal').boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width);
});
