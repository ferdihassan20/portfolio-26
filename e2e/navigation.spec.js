import { test, expect } from '@playwright/test';

async function openMenuIfCollapsed(page) {
  const menu = page.getByRole('button', { name: 'Toggle navigation' });
  if (await menu.isVisible()) await menu.click();
}

test('detail URL opened directly renders the app', async ({ page }) => {
  await page.goto('/work/ocean-health');
  await expect(page.getByRole('link', { name: 'Ferdi Hassan home' })).toBeVisible();
});

test('ABOUT from a detail page lands on the home About section', async ({ page }) => {
  await page.goto('/work/ocean-health');
  await openMenuIfCollapsed(page);
  await page.getByRole('navigation').getByRole('link', { name: 'ABOUT' }).click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator('#about')).toBeInViewport();
});

test('Download CV serves a PDF', async ({ request }) => {
  const res = await request.get('/cv/ferdi-hassan-cv.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/pdf');
});
