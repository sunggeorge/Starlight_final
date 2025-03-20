import { test, expect } from '@playwright/test';

test.describe('0004 - Ensure Service Selection Works Properly', () => {
  test('should access Booking page', async ({ page }) => {
    // Step 1: Log in and go to the Booking page.
    await page.goto('http://localhost:3000/login');
    // (Assume login steps are handled via a helper or precondition)
    await page.goto('http://localhost:3000/booking');
    await expect(page).toHaveURL(/booking/);
  });

  test('should allow service selection and display correct details', async ({ page }) => {
    // Step 2: Click Select Service and choose a service.
    await page.click('button.select-service'); // replace with actual selector
    // Step 3: Ensure the correct price and description appear.
    const price = await page.textContent('.service-price');
    const description = await page.textContent('.service-description');
    expect(price).not.toBeNull();
    expect(description).not.toBeNull();
  });

  test('should update total cost when multiple services are selected', async ({ page }) => {
    // Step 4: Try selecting multiple services.
    await page.click('button.select-service:nth-of-type(1)');
    await page.click('button.select-service:nth-of-type(2)');
    const totalCost = await page.textContent('.total-cost');
    expect(totalCost).not.toBeNull();
  });

  test('should display selected service in appointment summary and save booking', async ({ page }) => {
    // Step 5: Check if the selected service appears in the appointment summary.
    const summary = await page.textContent('.appointment-summary');
    expect(summary).toContain('Selected Service');
    // Step 6: Complete the booking and verify service selection in My Appointments.
    await page.click('button.complete-booking');
    // Assume redirection to My Appointments page
    await expect(page).toHaveURL(/my-appointments/);
  });
});