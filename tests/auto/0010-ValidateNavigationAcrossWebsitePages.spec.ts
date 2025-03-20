import { test, expect } from '@playwright/test';

test.describe('0010 - Validate Navigation Across Website Pages', () => {
  test('should allow navigation using the navigation menu', async ({ page }) => {
    // Step 1: Log in and use the navigation menu.
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test2@test.com');
    await page.fill('input[name="password"]', 'testtest');
    await page.click('button[type="submit"]');
    // Expect the update-password page to be accessible
    await page.waitForLoadState('networkidle');
    // Check if navigation menu is visible.
    await expect(page.locator('div.navbar-center')).toBeVisible();
  });


});