import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Gidel/i);
    
    // Check hero section is visible
    await expect(page.locator('section').first()).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check navbar exists
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
    
    // Check navigation links exist (use first() to handle multiple matches)
    await expect(page.getByRole('link', { name: /about/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /books/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /articles/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i }).first()).toBeVisible();
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /about/i }).first().click();
    
    await expect(page).toHaveURL(/about/);
  });

  test('should navigate to Books page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /books/i }).first().click();
    
    await expect(page).toHaveURL(/books/);
  });

  test('should have footer', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
