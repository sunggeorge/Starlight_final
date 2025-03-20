import { test, expect } from '@playwright/test';

test.describe('0029 - Validate Report Loading State', () => {
  test('should display a loading message and then show complete report content', async ({ page }) => {
    // Step 1: Open the web application.
    await page.goto('http://localhost:3000');
    // Step 2: Log in with valid credentials.
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'manager@example.com');
    await page.fill('input[name="password"]', 'ManagerPass');
    await page.click('button[type="submit"]');
    // Step 3: Navigate to the Sales Report page.
    await page.goto('http://localhost:3000/reports');
    // Step 4: Verify that the loading message "Loading report data..." appears.
    await expect(page.locator('text=Loading report data...')).toBeVisible();
    // Step 5: Wait for the loading message to disappear (indicating data load completion).
    await page.waitForSelector('text=Loading report data...', { state: 'detached' });
    // Step 6: Verify that the report content appears correctly.
    await expect(page.locator('.report-content')).toBeVisible();
  });
});