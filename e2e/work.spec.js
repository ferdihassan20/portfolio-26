import { test, expect } from '@playwright/test';
import { serveSampleDeck } from './helpers';

test.beforeEach(({ page }) => serveSampleDeck(page));

async function openSampleDeck(page) {
  await page.goto('/#work');
  await page.getByRole('heading', { name: 'Sample Deck', level: 3 }).click();
  return page.getByRole('dialog', { name: /Sample Deck/ });
}

test('card opens the popup with the PDF', async ({ page }) => {
  const dialog = await openSampleDeck(page);
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.pdf-page[data-page-number="1"] canvas')).toBeVisible({ timeout: 30_000 });
});

test('VIEW FULL CASE goes to the detail page and leaves it scrollable', async ({ page }) => {
  const dialog = await openSampleDeck(page);
  await dialog.getByRole('link', { name: 'VIEW FULL CASE →' }).click();
  await expect(page).toHaveURL(/\/work\/e2e-sample-deck$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('popup fits the viewport width', async ({ page }) => {
  const dialog = await openSampleDeck(page);
  const box = await dialog.locator('.project-modal').boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width);
});
