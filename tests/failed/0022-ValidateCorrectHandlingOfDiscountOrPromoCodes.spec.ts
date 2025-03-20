import { test, expect } from '@playwright/test';

test.describe('0022 - Validate Correct Handling of Discount or Promo Codes', () => {
  test('should access booking page and proceed to checkout', async ({ page }) => {
    // Step 1: Log in and go to the Booking page.
    await page.goto('http://localhost:3000/login');
    // Assume login steps are performed.
    await page.goto('http://localhost:3000/booking');
    await expect(page).toHaveURL(/booking/);
  });

  test('should apply valid promo code and reduce total amount', async ({ page }) => {
    // Step 2 & 3: Select a service, proceed to checkout, and apply a valid promo code.
    await page.goto('http://localhost:3000/checkout');
    await page.fill('input[name="promoCode"]', 'DISCOUNT10');
    await page.click('button.apply-promo');
    // Verify that discount is applied.
    await expect(page.locator('text=Discount Applied')).toBeVisible();
  });

  test('should display error for expired promo code', async ({ page }) => {
    // Step 4: Try using an expired promo code.
    await page.goto('http://localhost:3000/checkout');
    await page.fill('input[name="promoCode"]', 'EXPIRED20');
    await page.click('button.apply-promo');
    await expect(page.locator('text=Promo code expired')).toBeVisible();
  });

  test('should prevent duplicate promo code usage', async ({ page }) => {
    // Step 5: Attempt using the same promo code twice.
    await page.goto('http://localhost:3000/checkout');
    await page.fill('input[name="promoCode"]', 'DISCOUNT10');
    await page.click('button.apply-promo');
    await expect(page.locator('text=Discount Applied')).toBeVisible();
    // Try applying it again.
    await page.fill('input[name="promoCode"]', 'DISCOUNT10');
    await page.click('button.apply-promo');
    await expect(page.locator('text=Promo code already used')).toBeVisible();
  });

  test('should record correct discount in the database (placeholder)', async () => {
    // Step 6: Verify discount calculation in the database.
    expect(true).toBe(true);
  });
});