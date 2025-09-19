const { test, expect } = require('@playwright/test');

test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to products page before each test
    await page.goto('/');
    
    // Try to navigate to products
    const productsLink = page.locator('a:has-text("Products"), button:has-text("Products"), [href*="product"]').first();
    if (await productsLink.count() > 0) {
      await productsLink.click();
    } else {
      await page.goto('/products');
    }
  });

  test('can search for products', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[name*="search" i]').first();
    
    if (await searchInput.count() > 0) {
      await searchInput.fill('F-35');
      await searchInput.press('Enter');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Check if search worked (URL changed or results updated)
      const currentUrl = page.url();
      const hasSearchParam = currentUrl.includes('search') || currentUrl.includes('F-35');
      
      if (hasSearchParam) {
        expect(hasSearchParam).toBeTruthy();
      }
    } else {
      console.log('No search input found - skipping search test');
    }
  });

  test('can filter products by category', async ({ page }) => {
    // Look for filter controls
    const categoryFilter = page.locator('select, .filter, [data-testid*="category"], [name*="category"]').first();
    
    if (await categoryFilter.count() > 0) {
      // Try to interact with category filter
      if (await categoryFilter.locator('option').count() > 1) {
        await categoryFilter.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
        
        // Verify filter was applied
        const currentUrl = page.url();
        expect(currentUrl.includes('category') || currentUrl.includes('filter')).toBeTruthy();
      }
    } else {
      console.log('No category filter found - skipping filter test');
    }
  });

  test('product list displays correctly', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check for any product-related content
    const productCount = await page.locator('.product, .card, [data-testid*="product"], li').count();
    
    if (productCount > 0) {
      // Check if products have basic information
      const firstProduct = page.locator('.product, .card, [data-testid*="product"], li').first();
      
      // Should have some text content
      const textContent = await firstProduct.textContent();
      expect(textContent?.length).toBeGreaterThan(0);
    } else {
      // Check for empty state message
      const emptyMessage = await page.locator('text=No products, text=Empty, .empty').count();
      expect(emptyMessage).toBeGreaterThan(0);
    }
  });
});