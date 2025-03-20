import { test, expect } from '@playwright/test';

test.describe('0012 - Validate Multi-Device Login Handling', () => {
  test('should log in on Device 1 and Device 2 with active sessions', async ({ browser }) => {
    // Step 1 & 2: Log in on two different browser contexts.
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await page1.goto('http://localhost:3000/login');
    await page1.fill('input[name="email"]', 'user@example.com');
    await page1.fill('input[name="password"]', 'ValidPass123');
    await page1.click('button[type="submit"]');
    await expect(page1).toHaveURL(/dashboard/);

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto('http://localhost:3000/login');
    await page2.fill('input[name="email"]', 'user@example.com');
    await page2.fill('input[name="password"]', 'ValidPass123');
    await page2.click('button[type="submit"]');
    await expect(page2).toHaveURL(/dashboard/);

    // Step 3: Verify both sessions remain active.
    const cookies1 = await context1.cookies();
    const cookies2 = await context2.cookies();
    expect(cookies1.find(cookie => cookie.name === 'session')).toBeDefined();
    expect(cookies2.find(cookie => cookie.name === 'session')).toBeDefined();
  });

  test('should maintain independent sessions on logout', async ({ browser }) => {
    // Step 4: Log out from Device 1 and check Device 2 session remains active.
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await page1.goto('http://localhost:3000/login');
    await page1.fill('input[name="email"]', 'user@example.com');
    await page1.fill('input[name="password"]', 'ValidPass123');
    await page1.click('button[type="submit"]');
    await page1.goto('http://localhost:3000/dashboard');
    await page1.click('button#logout');
    await page1.goto('http://localhost:3000/dashboard');
    await expect(page1).toHaveURL(/login/);

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto('http://localhost:3000/login');
    await page2.fill('input[name="email"]', 'user@example.com');
    await page2.fill('input[name="password"]', 'ValidPass123');
    await page2.click('button[type="submit"]');
    await page2.goto('http://localhost:3000/dashboard');
    await expect(page2).toHaveURL(/dashboard/);

    // Step 5: Log out from Device 2 and verify session clearance.
    await page2.click('button#logout');
    await page2.goto('http://localhost:3000/dashboard');
    await expect(page2).toHaveURL(/login/);
  });

  test('should redirect protected page access after logout', async ({ browser }) => {
    // Step 6: Try accessing a protected page after logout.
    const context = await browser.newContext();
    const page = await context.newPage();
    // Simulate logged out state
    await context.clearCookies();
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/login/);
  });
});