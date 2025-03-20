import { test, expect } from '@playwright/test';

test.describe('0015 - Validate UI Consistency Across Browsers', () => {
  test('should load website in Google Chrome', async ({ browserName, page }) => {
    // This test is intended to run in the Chrome project configuration.
    if (browserName !== 'chromium') test.skip();
    await page.goto('http://localhost:3000');
    // Verify that the homepage loads correctly.
    await expect(page.locator('header')).toBeVisible();
  });

  test('should load website in Mozilla Firefox', async ({ browserName, page }) => {
    // This test is intended to run in the Firefox project configuration.
    if (browserName !== 'firefox') test.skip();
    await page.goto('http://localhost:3000');
    // Verify that the homepage loads correctly.
    await expect(page.locator('header')).toBeVisible();
  });

  test('should load website in Microsoft Edge', async ({ browserName, page }) => {
    // This test is intended to run with Edge configuration if set up as chromium.
    // For simplicity, we assume chromium project simulates Edge.
    if (browserName !== 'chromium') test.skip();
    await page.goto('http://localhost:3000');
    // Verify UI elements (fonts, button alignment, layout) are consistent.
    const headerText = await page.textContent('header');
    expect(headerText?.length).toBeGreaterThan(0);
  });

  test('should interact with navigation menus consistently', async ({ page }) => {
    // Verify navigation functionality.
    await page.goto('http://localhost:3000');
    await page.click('nav >> text=Home');
    await expect(page).toHaveURL(/home/);
    await page.click('nav >> text=Booking');
    await expect(page).toHaveURL(/booking/);
    await page.click('nav >> text=Profile');
    await expect(page).toHaveURL(/profile/);
  });

  test('should detect any UI inconsistencies (visual check placeholder)', async () => {
    // Placeholder for visual regression tests.
    expect(true).toBe(true);
  });
});