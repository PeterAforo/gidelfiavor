import { test, expect } from '@playwright/test';

test.describe('Books Page', () => {
  test('should load books page', async ({ page }) => {
    await page.goto('/books');
    
    await expect(page).toHaveTitle(/Books|Gidel/i);
  });

  test('should display books grid or list', async ({ page }) => {
    await page.goto('/books');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Should have main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have page heading', async ({ page }) => {
    await page.goto('/books');
    
    // Check for a heading
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });
});
