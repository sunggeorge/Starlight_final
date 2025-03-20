import { test, expect } from '@playwright/test';

test.describe('0021 - Validate User Profile Update Functionality', () => {
  test('should display Profile Settings page after login', async ({ page }) => {
    // Step 1: Log in and navigate to Profile Settings.
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'ValidPass123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:3000/profile/settings');
    await expect(page).toHaveURL(/profile\/settings/);
  });

  test('should update user details and display updated information', async ({ page }) => {
    // Step 2: Update user details such as first name, last name, and profile picture.
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    // For profile picture, assume there's an upload button/input.
    await page.setInputFiles('input[type="file"]', 'tests/testdata/sample-profile.jpg');
    // Step 3: Save changes and refresh the page.
    await page.click('button.save-profile');
    await page.reload();
    // Verify that updated details are displayed.
    const firstName = await page.getAttribute('input[name="firstName"]', 'value');
    const lastName = await page.getAttribute('input[name="lastName"]', 'value');
    expect(firstName).toBe('John');
    expect(lastName).toBe('Doe');
  });

  test('should persist updates after logout and re-login', async ({ page }) => {
    // Step 4: Log out and log back in to verify if updates persist.
    await page.click('button#logout');
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'ValidPass123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:3000/profile/settings');
    const firstName = await page.getAttribute('input[name="firstName"]', 'value');
    const lastName = await page.getAttribute('input[name="lastName"]', 'value');
    expect(firstName).toBe('John');
    expect(lastName).toBe('Doe');
  });

  test('should deny updating another user\'s profile', async ({ page }) => {
    // Step 5: Attempt to update another user's profile.
    await page.goto('http://localhost:3000/profile/settings?userId=anotherUser');
    // Expect an access denied message.
    await expect(page.locator('text=Access denied')).toBeVisible();
  });

  test('should reflect updated profile data in the database (placeholder)', async () => {
    // Step 6: Verify the updated profile data in the database.
    // This is a placeholder for an actual database/API verification.
    expect(true).toBe(true);
  });
});