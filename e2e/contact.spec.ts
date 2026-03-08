import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test('should load contact page', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page).toHaveTitle(/Contact|Gidel/i);
  });

  test('should display contact form', async ({ page }) => {
    await page.goto('/contact');
    
    // Check form fields exist
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to submit empty form
    await page.getByRole('button', { name: /send|submit/i }).click();
    
    // Should show validation error
    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill invalid email
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/message/i).fill('Test message');
    
    await page.getByRole('button', { name: /send|submit/i }).click();
    
    // Should show email validation error
    await expect(page.getByText(/valid email|invalid email/i)).toBeVisible();
  });
});
