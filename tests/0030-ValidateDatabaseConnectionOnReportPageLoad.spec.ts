import { test, expect } from '@playwright/test';

test.describe('0030 - Validate Database Connection on Report Page Load', () => {
  test('should open the web application and login with valid credentials', async ({ page }) => {
    // Step 1: Open the web application.
    await page.goto('http://localhost:3000');
    // Step 2: Log in using valid credentials.
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'manager@example.com');
    await page.fill('input[name="password"]', 'ManagerPass');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should retrieve report data and verify database connection', async ({ page }) => {
    // Step 3: Navigate to the "Sales Report" page.
    await page.goto('http://localhost:3000/reports');
    await expect(page).toHaveURL(/reports/);
    // Step 4: Verify that a request is sent to retrieve report data.
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/report') && resp.status() === 200),
      page.reload()
    ]);
    expect(response).toBeTruthy();
    // Step 5: Check if database connection is established successfully.
    const jsonData = await response.json();
    expect(jsonData).toBeDefined();
    // Step 6: Ensure that the report data is displayed correctly.
    await expect(page.locator('.report-content')).toBeVisible();
  });
});