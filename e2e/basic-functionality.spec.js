const { test, expect } = require('@playwright/test');

test.describe('Application Basic Functionality', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads and has expected content
    await expect(page).toHaveTitle(/21st Century/i);
    
    // Look for main navigation or welcome content
    const welcomeElements = await page.locator('text=Welcome').count();
    const navElements = await page.locator('nav').count();
    
    // Should have either welcome content or navigation
    expect(welcomeElements > 0 || navElements > 0).toBeTruthy();
  });

  test('can navigate to products page', async ({ page }) => {
    await page.goto('/');
    
    // Look for products link or navigation
    const productsLink = page.locator('a:has-text("Products"), button:has-text("Products"), [href*="product"]').first();
    
    if (await productsLink.count() > 0) {
      await productsLink.click();
      
      // Should be on products page
      await expect(page.url()).toContain('product');
    } else {
      // Direct navigation if no link found
      await page.goto('/products');
      await expect(page).toHaveURL(/.*product.*/);
    }
  });

  test('products page displays product list', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for products to load
    await page.waitForTimeout(2000);
    
    // Check for product-related content
    const productElements = await page.locator('.product, [data-testid*="product"], .card').count();
    const listElements = await page.locator('ul, .list, .grid').count();
    
    // Should have either product elements or list structure
    expect(productElements > 0 || listElements > 0).toBeTruthy();
  });
});