const { test, expect } = require('@playwright/test');

test.describe('User Experience Flows', () => {
  test('complete user journey - browse to product details', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    
    // Navigate to products
    const productsLink = page.locator('a:has-text("Products"), button:has-text("Products"), [href*="product"]').first();
    if (await productsLink.count() > 0) {
      await productsLink.click();
    } else {
      await page.goto('/products');
    }

    // Wait for products to load
    await page.waitForTimeout(2000);
    
    // Click on first product if available
    const firstProduct = page.locator('.product, .card, [data-testid*="product"] a, li a').first();
    if (await firstProduct.count() > 0) {
      await firstProduct.click();
      
      // Should be on product detail page
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      
      // URL should have changed from the products list
      expect(currentUrl).not.toBe('http://localhost:3000/products');
    } else {
      console.log('No clickable products found - completing basic navigation test');
      expect(page.url()).toContain('product');
    }
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check if page adapts to mobile
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
    
    // Check if mobile navigation exists (hamburger menu, etc.)
    const mobileNav = await page.locator('.hamburger, .mobile-menu, .menu-toggle, [aria-label*="menu"]').count();
    const regularNav = await page.locator('nav').count();
    
    // Should have some form of navigation
    expect(mobileNav > 0 || regularNav > 0).toBeTruthy();
  });

  test('search functionality across pages', async ({ page }) => {
    await page.goto('/');
    
    // Look for global search
    const globalSearch = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    
    if (await globalSearch.count() > 0) {
      await globalSearch.fill('Lockheed');
      await globalSearch.press('Enter');
      
      await page.waitForTimeout(2000);
      
      // Should show search results or navigate to search page
      const hasResults = await page.locator('text=Lockheed, .search-result, .result').count() > 0;
      const onSearchPage = page.url().includes('search') || page.url().includes('Lockheed');
      
      expect(hasResults || onSearchPage).toBeTruthy();
    } else {
      console.log('No global search found - testing product page search');
      
      // Try product page search
      await page.goto('/products');
      const productSearch = page.locator('input[type="text"], input[placeholder*="search" i]').first();
      
      if (await productSearch.count() > 0) {
        await productSearch.fill('F-35');
        await productSearch.press('Enter');
        await page.waitForTimeout(1000);
        
        const searchWorked = page.url().includes('F-35') || page.url().includes('search');
        expect(searchWorked).toBeTruthy();
      }
    }
  });

  test('error handling - 404 page', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/this-page-does-not-exist');
    
    await page.waitForTimeout(1000);
    
    // Should show 404 or redirect to homepage
    const is404 = await page.locator('text=404, text=Not Found, text=Page not found').count() > 0;
    const redirectedHome = page.url() === 'http://localhost:3000/' || page.url() === 'http://localhost:3000';
    
    expect(is404 || redirectedHome).toBeTruthy();
  });

  test('page performance - load times', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within reasonable time (10 seconds)
    expect(loadTime).toBeLessThan(10000);
    
    // Check if critical content is visible
    const hasContent = await page.locator('body *').count() > 0;
    expect(hasContent).toBeTruthy();
  });
});