import { test, expect } from '@playwright/test';

test.describe('0017 - Validate Password Reset Functionality', () => {
  test('should display Forgot Password page when clicked', async ({ page }) => {
    // Step 1: Open the login page and click 'Forgot Password'.
    await page.goto('http://localhost:3000/login');
    await page.click('text=Forgot Password');
    await expect(page).toHaveURL(/forgot-password/);
  });

  test('should submit password reset request and show success message', async ({ page }) => {
    // Step 2: Enter a registered email and submit the request.
    await page.goto('http://localhost:3000/forgot-password');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.click('button[type="submit"]');
    // Step 3: Check for a success message indicating that a reset link was sent.
    await expect(page.locator('text=Password reset link sent')).toBeVisible();
  });

  test('should reset password using the reset link', async ({ page }) => {
    // Step 4: Click on the reset link and enter a new password (simulated).
    // This placeholder simulates clicking the reset link received by email.
    await page.goto('http://localhost:3000/reset-password?token=sampleToken');
    await page.fill('input[name="newPassword"]', 'NewValidPass123');
    await page.click('button[type="submit"]');
    // Step 5: Verify that a success message is displayed after password reset.
    await expect(page.locator('text=Password has been reset')).toBeVisible();
  });

  test('should reject login with old password after reset', async ({ page }) => {
    // Step 6: Attempt to log in with the old password.
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'OldPass123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});