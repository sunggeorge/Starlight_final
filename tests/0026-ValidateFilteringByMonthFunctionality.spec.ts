import { test, expect } from '@playwright/test';

test.describe('0026 - Validate Filtering by Month Functionality', () => {
  test('should load the Sales Report page', async ({ page }) => {
    // Step 1: Navigate to the Sales Report page.
    await page.goto('http://localhost:3000/reports');
    await expect(page).toHaveURL(/reports/);
  });

  test('should display the Filter by Date input field', async ({ page }) => {
    // Step 2: Locate the 'Filter by Date' input field.
    const filterInput = page.locator('input[name="filterDate"]');
    await expect(filterInput).toBeVisible();
  });

  test('should filter orders by a selected month', async ({ page }) => {
    // Step 3: Select a specific month (e.g., "2024-02").
    await page.fill('input[name="filterDate"]', '2024-02');
    await page.click('button.apply-filter');
    // Step 4: Verify that the orders table updates with filtered results.
    const orders = await page.$$eval('.order-row', rows =>
      rows.map(row => row.textContent)
    );
    for (const order of orders) {
      expect(order).toContain('2024-02');
    }
  });

  test('should not display orders from other months after filtering', async ({ page }) => {
    // Step 5: Ensure that orders from different months are not displayed.
    const orders = await page.$$eval('.order-row', rows =>
      rows.map(row => row.textContent)
    );
    for (const order of orders) {
      expect(order).not.toContain('2024-03');
    }
  });

  test('should clear the filter and display all orders', async ({ page }) => {
    // Step 6: Clear the filter and check if all orders are displayed again.
    await page.click('button.clear-filter');
    const allOrders = await page.$$('.order-row');
    expect(allOrders.length).toBeGreaterThan(0);
  });
});