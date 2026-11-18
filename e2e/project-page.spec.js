import { test, expect } from '@playwright/test';

test('layout: side by side on desktop with sticky info, stacked on smaller screens', async ({ page }, testInfo) => {
  await page.goto('/work/consumer-strategy');
  const info = page.locator('.project-info');
  const viewer = page.locator('.project-deck');
  await expect(viewer.locator('.pdf-page[data-page-number="1"] canvas')).toBeVisible({ timeout: 30_000 });
  const i = await info.boundingBox();
  const v = await viewer.boundingBox();
  if (testInfo.project.name === 'desktop') {
    expect(i.x + i.width).toBeLessThanOrEqual(v.x);
    await page.mouse.wheel(0, 1500);
    await expect(info).toBeInViewport();
  } else {
    expect(i.y + i.height).toBeLessThanOrEqual(v.y);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('next / previous navigation scrolls back to the top', async ({ page }) => {
  await page.goto('/work/ocean-health');
  const next = page.getByRole('link', { name: /next project/i });
  await next.scrollIntoViewIfNeeded();
  await next.click();
  await expect(page).toHaveURL(/\/work\/telkom-product$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('unknown project shows not found', async ({ page }) => {
  await page.goto('/work/does-not-exist');
  await expect(page.getByText('Project not found')).toBeVisible();
});
