import { test, expect } from '@playwright/test';

test.describe('0002 - Test User Login', () => {
  test('should allow login with newly registered account', async ({ page }) => {
    // Step 6: Try logging in with the new account.
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test2@test.com');
    await page.fill('input[name="password"]', 'testtest');
    await page.click('button[type="submit"]');
    // Expect the update-password page to be accessible
    await page.waitForLoadState('networkidle');
    await page.goto('http://localhost:3000/update-password');
    await expect(page.locator('button[type="submit"]')).toHaveText('Update Password');
  });
});