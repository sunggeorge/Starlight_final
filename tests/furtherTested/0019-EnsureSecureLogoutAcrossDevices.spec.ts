import { test, expect } from '@playwright/test';

test.describe('0019 - Ensure Secure Logout Across Devices', () => {
  test('should maintain active session on Device 2 after logging out Device 1', async ({ browser }) => {
    // Step 1: Log in from Device 1.
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await page1.goto('http://localhost:3000/login');
    await page1.fill('input[name="email"]', 'user@example.com');
    await page1.fill('input[name="password"]', 'ValidPass123');
    await page1.click('button[type="submit"]');
    await expect(page1).toHaveURL(/dashboard/);

    // Step 2: Log in from Device 2.
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto('http://localhost:3000/login');
    await page2.fill('input[name="email"]', 'user@example.com');
    await page2.fill('input[name="password"]', 'ValidPass123');
    await page2.click('button[type="submit"]');
    await expect(page2).toHaveURL(/dashboard/);

    // Step 3: Log out from Device 1.
    await page1.click('button#logout'); // Replace with actual selector.
    await page1.goto('http://localhost:3000/dashboard');
    await expect(page1).toHaveURL(/login/);

    // Step 4: Verify Device 2 session remains active.
    await page2.goto('http://localhost:3000/dashboard');
    await expect(page2).toHaveURL(/dashboard/);

    // Step 5: Log out from Device 2.
    await page2.click('button#logout');
    await page2.goto('http://localhost:3000/dashboard');
    await expect(page2).toHaveURL(/login/);

    // Step 6: Attempt to access a protected page after logout.
    const context3 = await browser.newContext();
    const page3 = await context3.newPage();
    await page3.goto('http://localhost:3000/dashboard');
    await expect(page3).toHaveURL(/login/);
  });
});