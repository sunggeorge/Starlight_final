import { test, expect } from '@playwright/test';

test.describe('0016 - Validate Filtering for Services', () => {
  test('should access Booking page', async ({ page }) => {
    // Step 1: Log in and go to the Booking page.
    await page.goto('http://localhost:3000/login');
    // Assume login steps are performed here.
    await page.goto('http://localhost:3000/booking');
    await expect(page).toHaveURL(/booking/);
  });

  test('should filter services by category', async ({ page }) => {
    // Step 2: Click on the Filter Services option and choose a category.
    await page.click('button.filter-services'); // Replace with actual selector
    await page.click('text=Category Name'); // Replace with actual category selection
    // Verify that only services from the selected category are displayed.
    const servicesText = await page.locator('.service-item').allTextContents();
    for (const text of servicesText) {
      expect(text).toContain('Category Name');
    }
  });

  test('should sort services by Price: Low to High', async ({ page }) => {
    // Step 3: Click on the Sort option and select "Price: Low to High".
    await page.click('button.sort-options'); // Replace with actual selector
    await page.click('text=Price: Low to High');
    // Verify that the services are sorted in ascending order.
    const prices = await page.$$eval('.service-price', elements =>
      elements.map(el => parseFloat(el.textContent?.replace(/[^0-9.]/g, "") || "0"))
    );
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('should clear filters and display default results', async ({ page }) => {
    // Step 6: Clear the filter by clicking the All button.
    await page.click('button.clear-filters'); // Replace with actual selector
    // Verify that all orders or services are displayed again.
    const allServices = await page.$$('.service-item');
    expect(allServices.length).toBeGreaterThan(0);
  });
});
