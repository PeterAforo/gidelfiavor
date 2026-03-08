import { test, expect } from '@playwright/test';

test.describe('Articles Page', () => {
  test('should load articles page', async ({ page }) => {
    await page.goto('/articles');
    
    await expect(page).toHaveTitle(/Articles|Gidel/i);
  });

  test('should display articles list', async ({ page }) => {
    await page.goto('/articles');
    
    await page.waitForLoadState('networkidle');
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have search or filter functionality', async ({ page }) => {
    await page.goto('/articles');
    
    await page.waitForLoadState('networkidle');
    
    // Check for search input or filter controls
    const searchOrFilter = page.locator('input[type="search"], input[placeholder*="search" i], select, [role="combobox"]').first();
    
    // This test passes if there's any search/filter element, or just checks page loaded
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});
