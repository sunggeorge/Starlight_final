import { test, expect } from '@playwright/test';

test.describe('0020 - Validate Client Appointment Confirmation Page', () => {
  test('should display booking confirmation message after booking', async ({ page }) => {
    // Step 1: Log in and book an appointment.
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'ValidPass123');
    await page.click('button[type="submit"]');
    // Assume booking is made and confirmation page is shown.
    await page.goto('http://localhost:3000/booking/confirmation');
    await expect(page.locator('text=Booking confirmed')).toBeVisible();
  });

  test('should display latest booking in My Appointments', async ({ page }) => {
    // Step 2: Navigate to My Appointments and check latest booking.
    await page.goto('http://localhost:3000/my-appointments');
    const booking = await page.locator('.appointment-item').first();
    await expect(booking).toBeVisible();
  });

  test('should display appointment details on clicking a booking', async ({ page }) => {
    // Step 3: Click on a booking to view appointment details.
    await page.click('.appointment-item');
    await expect(page).toHaveURL(/appointment\/\d+/);
    // Verify that details such as service, technician, date, and time are present.
    const details = await page.textContent('.appointment-details');
    expect(details).toContain('Service');
    expect(details).toContain('Technician');
    expect(details).toContain('Date');
    expect(details).toContain('Time');
  });

  test('should show correct booking status', async ({ page }) => {
    // Step 4: Verify that appointment status shows as "Confirmed".
    const status = await page.textContent('.appointment-status');
    expect(status).toContain('Confirmed');
  });

  test('should allow navigation back to My Appointments', async ({ page }) => {
    // Step 6: Navigate back to My Appointments from confirmation page.
    await page.click('button.back-to-appointments');
    await expect(page).toHaveURL(/my-appointments/);
    
    test('should display Update Password submit button', async ({ page }) => {
      await page.goto('http://localhost:3000/update-password');
      await expect(page.locator('button[type="submit"]')).toHaveText('Update Password');
    });
  });
});
