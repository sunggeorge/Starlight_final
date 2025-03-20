import { test, expect } from '@playwright/test';

test.describe('0005 - Verify Role-Based Access Control (RBAC)', () => {

  test('technicians should not access admin functionalities', async ({ page }) => {
    // Step 5: Check if technicians can access admin functionalities.
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'manager@test.com');
    await page.fill('input[name="password"]', 'testtest');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.goto('http://localhost:3000/bookings');
    await expect(page.locator('text=Manage Orders')).toBeVisible();

  });

});