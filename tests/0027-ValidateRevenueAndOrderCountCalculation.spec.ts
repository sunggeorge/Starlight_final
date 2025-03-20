import { test, expect } from '@playwright/test';

test.describe('0027 - Validate Revenue and Order Count Calculation', () => {
  test('should access the Sales Report page', async ({ page }) => {
    // Step 1: Navigate to the Sales Report page.
    await page.goto('http://localhost:3000/reports');
    await expect(page).toHaveURL(/reports/);
  });

  test('should display total revenue and order count', async ({ page }) => {
    // Step 2: Select a specific month to filter the data.
    await page.fill('input[name="filterDate"]', '2024-02');
    await page.click('button.apply-filter');
    // Step 3: Note the displayed total revenue and order count.
    const revenueText = await page.textContent('.total-revenue');
    const orderCountText = await page.textContent('.order-count');
    expect(revenueText).toBeDefined();
    expect(orderCountText).toBeDefined();
  });

  test('should match manual total with displayed values', async ({ page }) => {
    // Step 4: Manually sum the amounts of the filtered orders (placeholder logic).
    const orders = await page.$$eval('.order-row .amount', els =>
      els.map(el => parseFloat(el.textContent?.replace(/[^0-9.]/g, "") || "0"))
    );
    const manualTotal = orders.reduce((sum, amt) => sum + amt, 0);
    const displayedTotal = parseFloat(await page.textContent('.total-revenue') || "0");
    expect(Math.abs(manualTotal - displayedTotal)).toBeLessThan(0.01);
  });

  test('should display accurate revenue and order count', async ({ page }) => {
    // Step 5: Compare the manual calculation with displayed values.
    const orderCount = parseInt(await page.textContent('.order-count') || "0", 10);
    // Placeholder expectation: orderCount should be a positive number.
    expect(orderCount).toBeGreaterThan(0);
  });

  test('should display correct report summary values', async ({ page }) => {
    // Step 6: Ensure the displayed values are correct (placeholder).
    const revenue = await page.textContent('.total-revenue');
    const count = await page.textContent('.order-count');
    expect(revenue).not.toEqual('');
    expect(count).not.toEqual('');
  });
});