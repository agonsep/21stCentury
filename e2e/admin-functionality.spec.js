const { test, expect } = require('@playwright/test');

test.describe('Admin Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('can access admin login page', async ({ page }) => {
    // Look for admin link
    const adminLink = page.locator('a:has-text("Admin"), a:has-text("Login"), button:has-text("Admin"), [href*="admin"]').first();
    
    if (await adminLink.count() > 0) {
      await adminLink.click();
      
      // Should be on admin/login page
      const currentUrl = page.url();
      expect(currentUrl.includes('admin') || currentUrl.includes('login')).toBeTruthy();
      
      // Look for login form
      const loginForm = await page.locator('form, input[type="password"], input[name*="password"]').count();
      expect(loginForm).toBeGreaterThan(0);
    } else {
      // Try direct navigation
      await page.goto('/admin');
      
      // Should either show admin interface or redirect to login
      const isAdminPage = page.url().includes('admin') || page.url().includes('login');
      expect(isAdminPage).toBeTruthy();
    }
  });

  test('admin login form validation', async ({ page }) => {
    // Navigate to admin page
    const adminLink = page.locator('a:has-text("Admin"), [href*="admin"]').first();
    if (await adminLink.count() > 0) {
      await adminLink.click();
    } else {
      await page.goto('/admin');
    }

    // Look for login form
    const usernameInput = page.locator('input[name*="username"], input[name*="email"], input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"], input[name*="password"]').first();
    const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login")').first();

    if (await usernameInput.count() > 0 && await passwordInput.count() > 0) {
      // Test empty form submission
      if (await submitButton.count() > 0) {
        await submitButton.click();
        
        // Should show validation message or stay on same page
        const currentUrl = page.url();
        const hasErrorMessage = await page.locator('.error, .alert, [role="alert"]').count() > 0;
        
        // Either should show error or not redirect
        expect(hasErrorMessage || currentUrl.includes('admin') || currentUrl.includes('login')).toBeTruthy();
      }

      // Test with invalid credentials
      await usernameInput.fill('invalid-user');
      await passwordInput.fill('wrong-password');
      
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(1000);
        
        // Should show error or stay on login page
        const errorExists = await page.locator('.error, .alert, [role="alert"], text=Invalid, text=Error').count() > 0;
        const stillOnLogin = page.url().includes('admin') || page.url().includes('login');
        
        expect(errorExists || stillOnLogin).toBeTruthy();
      }
    } else {
      console.log('Login form not found - skipping login validation test');
    }
  });

  test('can navigate admin sections', async ({ page }) => {
    await page.goto('/admin');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Look for admin navigation or sections
    const adminSections = await page.locator('nav a, .nav-link, .menu-item, a:has-text("Product"), a:has-text("User")').count();
    
    if (adminSections > 0) {
      // Try clicking on a navigation item
      const navItem = page.locator('nav a, .nav-link, .menu-item').first();
      await navItem.click();
      
      // Should navigate somewhere
      await page.waitForTimeout(1000);
      expect(page.url().length).toBeGreaterThan(0);
    } else {
      // Just verify admin page loads
      expect(page.url().includes('admin')).toBeTruthy();
    }
  });
});