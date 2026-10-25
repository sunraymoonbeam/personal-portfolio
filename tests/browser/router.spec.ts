import { expect, test } from '@playwright/test';

test('contact controls work on the second client-router visit', async ({ page }) => {
  await page.goto('/');
  const marker = await page.evaluate(() => {
    const value = crypto.randomUUID();
    document.documentElement.dataset.testDocument = value;
    (window as Window & { testDocument?: string }).testDocument = value;
    return value;
  });
  for (let visit = 0; visit < 2; visit++) {
    await page.locator('header a.cta').click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await expect(page.locator('[data-contact]')).toBeVisible();
    await expect(page.locator('[data-copy]')).toBeVisible();
    await page.locator('[data-copy]').click();
    await expect(page.locator('[data-copy-label]')).toHaveText('Copied');
    // A synthetic empty event checks validation without opening a mail client.
    await page.locator('[data-contact]').evaluate((form) => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await expect(page.locator('[data-contact] [aria-invalid="true"]')).toHaveCount(3);
    await expect(page.locator('#name')).toBeFocused();
    await expect
      .poll(() => page.evaluate(() => (window as Window & { testDocument?: string }).testDocument))
      .toBe(marker);
    await page.locator('header a.nav-link[href="/about/"]').click();
    await expect(page).toHaveURL(/\/about\/$/);
  }
});

test('theme and search survive a client-router navigation', async ({ page }) => {
  await page.goto('/about/');
  await page.locator('.theme-wide [data-theme-toggle]').click();
  await page.locator('header a.nav-link[href="/work/"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('button.trigger[data-search-open]').click();
  await page.locator('[data-search-input]').fill('Carro');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-search-panel] a[href="/work/carro/"]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-search-panel]')).not.toBeVisible();
});

test('lightbox works after leaving and returning to an article', async ({ page }) => {
  await page.goto('/about/');
  for (let visit = 0; visit < 2; visit++) {
    await page.locator('header a.nav-link[href="/hobbies/"]').click();
    await page.locator('a.cell[href="/hobbies/climbing/"]').click();
    await page.locator('[data-lightbox]').first().click();
    await expect(page.locator('dialog.lightbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog.lightbox')).not.toBeVisible();
    await page.locator('header a.nav-link[href="/about/"]').click();
  }
});

test('without JavaScript the direct email link replaces the inactive form', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4357/contact/');
    await expect(page.locator('a.mail[href^="mailto:"]')).toBeVisible();
    await expect(page.locator('[data-contact]')).not.toBeVisible();
  } finally {
    await context.close();
  }
});
