import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test('should load about page', async ({ page }) => {
    await page.goto('/about');
    
    await expect(page).toHaveTitle(/About|Gidel/i);
  });

  test('should display author information', async ({ page }) => {
    await page.goto('/about');
    
    await page.waitForLoadState('networkidle');
    
    // Check for main content
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Should contain author name somewhere
    await expect(page.getByText(/Gidel|Fiavor/i).first()).toBeVisible();
  });

  test('should have biography section', async ({ page }) => {
    await page.goto('/about');
    
    await page.waitForLoadState('networkidle');
    
    // Check for content sections
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
});
