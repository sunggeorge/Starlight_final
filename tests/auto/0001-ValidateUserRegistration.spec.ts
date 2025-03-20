import { test, expect } from '@playwright/test';

test.describe('0001 - Validate User Registration', () => {
  test('should display sign-up page', async ({ page }) => {
    // Step 1: Open the website and navigate to the Sign-Up page.
    await page.goto('http://localhost:3000/signup');
    await expect(page).toHaveURL(/signup/);
  });


});