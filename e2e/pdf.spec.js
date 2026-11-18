import { test, expect } from '@playwright/test';

const DECK = '/__pdf-test?src=/projects/kita-ngantuk-gmbcc-semifinal.pdf';
const page1 = '.pdf-page[data-page-number="1"] canvas';

test('renders the first page as a canvas', async ({ page }) => {
  await page.goto(DECK);
  await expect(page.locator(page1)).toBeVisible({ timeout: 30_000 });
});

test('later pages render only after scrolling near them', async ({ page }) => {
  await page.goto(DECK);
  await expect(page.locator(page1)).toBeVisible({ timeout: 30_000 });
  const page30 = page.locator('.pdf-page[data-page-number="30"]');
  await expect(page30.locator('canvas')).toHaveCount(0);
  await page30.scrollIntoViewIfNeeded();
  await expect(page30.locator('canvas')).toBeVisible({ timeout: 30_000 });
});

test('page width follows the container on resize', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'resize check runs on desktop only');
  await page.goto(DECK);
  const canvas = page.locator(page1);
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  const before = (await canvas.boundingBox()).width;
  await page.setViewportSize({ width: 700, height: 900 });
  // The canvas is briefly replaced while re-rendering at the new width.
  await expect.poll(async () => (await canvas.boundingBox())?.width ?? Infinity, { timeout: 10_000 }).toBeLessThan(before);
});

test('broken PDF shows an error with a download link', async ({ page }) => {
  // vite preview answers unknown files with index.html; Vercel returns a real 404.
  await page.route((url) => url.pathname === '/projects/missing.pdf', (route) => route.fulfill({ status: 404, body: 'Not found' }));
  await page.goto('/__pdf-test?src=/projects/missing.pdf');
  await expect(page.getByText("Couldn't load the PDF.")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('link', { name: 'Download PDF' })).toHaveAttribute('href', '/projects/missing.pdf');
});
