import { test, expect } from '@playwright/test';

test.describe('0025 - Validate Report Page Accessibility', () => {
  test('should launch the web application successfully', async ({ page }) => {
    // Step 1: Open the web application.
    await page.goto('http://localhost:3000');
    await expect(page).toHaveURL(/localhost/);
  });

  test('should log in as manager and access dashboard', async ({ page }) => {
    // Step 2: Log in as manager.
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'manager@example.com');
    await page.fill('input[name="password"]', 'ManagerPass');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should navigate to Reports page via navigation menu', async ({ page }) => {
    // Step 3: Click on the "Reports" option in the navigation menu.
    await page.click('nav >> text=Reports');
    // Step 4: Verify that the "Sales Report" page is displayed.
    await expect(page).toHaveURL(/reports/);
    // Step 5: Ensure that the report title "Sales Report" is visible.
    await expect(page.locator('h1')).toContainText('Sales Report');
  });

  test('should load the report page without errors', async ({ page }) => {
    // Step 6: Check if the page loads without errors.
    const errors = await page.$$('.error-message');
    expect(errors.length).toBe(0);
  });
});