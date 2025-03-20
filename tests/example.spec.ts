/// <reference types="@playwright/test" />
import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }: { page: import('@playwright/test').Page }) => {
  await page.goto('http://localhost:3000');
  const title = await page.title();
  // Replace 'Expected Title' with the actual title of your homepage
  expect(title).toBe('Nail Shop Online System - Home');
});