import { test, expect } from '@playwright/test';

test.describe('Admin Login', () => {
  test('should load admin login page', async ({ page }) => {
    await page.goto('/admin');
    
    await expect(page.getByRole('heading', { name: /login|sign in|admin/i })).toBeVisible();
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/admin');
    
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/admin');
    
    await page.getByLabel(/email/i).fill('invalid@test.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid|error|failed/i)).toBeVisible({ timeout: 10000 });
  });

  test('should redirect to dashboard on successful login', async ({ page }) => {
    await page.goto('/admin');
    
    // Use test credentials (these should be valid in test environment)
    await page.getByLabel(/email/i).fill('admin@gidelfiavor.com');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });
});

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/admin');
    await page.getByLabel(/email/i).fill('admin@gidelfiavor.com');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await page.waitForURL(/dashboard/, { timeout: 10000 });
  });

  test('should display dashboard after login', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should have sidebar navigation', async ({ page }) => {
    // Check sidebar links exist
    await expect(page.getByRole('link', { name: /books/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /articles/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /pages/i })).toBeVisible();
  });
});
