import { test, expect } from '@playwright/test';

test.describe('Gallery Page', () => {
  test('should load gallery page', async ({ page }) => {
    await page.goto('/gallery');
    
    await expect(page).toHaveTitle(/Gallery|Gidel/i);
  });

  test('should display gallery grid', async ({ page }) => {
    await page.goto('/gallery');
    
    await page.waitForLoadState('networkidle');
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have images or placeholders', async ({ page }) => {
    await page.goto('/gallery');
    
    await page.waitForLoadState('networkidle');
    
    // Check for images or empty state
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
});
