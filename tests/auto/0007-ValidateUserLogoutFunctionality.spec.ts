import { test, expect } from '@playwright/test';

test.describe('0007 - Validate User Logout Functionality', () => {


  test('should log out successfully and redirect to login', async ({ page }) => {
    // Step 1: Login Test    
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test2@test.com');
    await page.fill('input[name="password"]', 'testtest');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Step 2: First click on the avatar to reveal logout options.
    await page.click('div.avatar');  // Click on the avatar.
    // await page.waitForLoadState('networkidle');
    
    // Then click on the Logout button.
    await page.click('button:has-text("Logout")');  // Updated selector using text content.
    await page.waitForLoadState('networkidle');
    // Step 3: Inspect session storage or cookies after logout.
    // Optionally retrieve cookies; here we expect no session cookie.
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'session');
    expect(sessionCookie).toBeUndefined();

  });

});