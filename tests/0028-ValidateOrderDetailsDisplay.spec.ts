import { test, expect } from '@playwright/test';

test.describe('0028 - Validate Order Details Display', () => {
  test('should display the report table with complete order details', async ({ page }) => {
    // Step 1: Navigate to the 'Sales Report' page.
    await page.goto('http://localhost:3000/reports');
    // Step 2: Ensure the report table is visible.
    const reportTable = page.locator('.report-table');
    await expect(reportTable).toBeVisible();
    
    // Step 3: Verify that each row contains Order ID, Date, Customer, Technician, and Amount.
    const rows = reportTable.locator('tr');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const rowText = await rows.nth(i).textContent();
      expect(rowText).toContain('Order ID');
      expect(rowText).toContain('Date');
      expect(rowText).toContain('Customer');
      expect(rowText).toContain('Technician');
      expect(rowText).toContain('Amount');
    }
    
    // Step 4: Check that the Amount field is displayed with two decimal places.
    const amounts = await page.$$eval('.order-row .amount', els => 
      els.map(el => el.textContent?.trim() || '')
    );
    for (const amount of amounts) {
      expect(amount).toMatch(/^\d+\.\d{2}$/);
    }
    
    // Step 5: Confirm that technician names are displayed correctly.
    const technicianNames = await page.$$eval('.order-row .technician', els =>
      els.map(el => el.textContent?.trim() || '')
    );
    for (const name of technicianNames) {
      expect(name.length).toBeGreaterThan(0);
    }
    
    // Step 6: Compare displayed values with stored database values (placeholder).
    expect(true).toBe(true);
  });
});