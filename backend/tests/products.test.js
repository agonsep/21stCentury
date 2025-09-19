const request = require('supertest');
const app = require('../server');

describe('Products API', () => {
  let testProductId;

  describe('GET /api/products', () => {
    test('should return all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      // Check if response has expected product structure
      if (response.body.length > 0) {
        const product = response.body[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('cost');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('manufacturer');
        expect(product).toHaveProperty('origin');
      }
    });

    test('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=EV Charging Equipment')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      // If there are EV charging products, all should be in that category
      if (response.body.length > 0) {
        response.body.forEach(product => {
          expect(product.category).toBe('EV Charging Equipment');
        });
      }
    });

    test('should filter products by manufacturer', async () => {
      const response = await request(app)
        .get('/api/products?manufacturer=ChargePoint')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        response.body.forEach(product => {
          expect(product.manufacturer).toBe('ChargePoint');
        });
      }
    });

    test('should search products by name', async () => {
      const response = await request(app)
        .get('/api/products?search=ChargePoint')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        response.body.forEach(product => {
          expect(
            product.name.toLowerCase().includes('chargepoint') ||
            product.manufacturer.toLowerCase().includes('chargepoint')
          ).toBe(true);
        });
      }
    });
  });

  describe('GET /api/products/manufacturers', () => {
    test('should return list of manufacturers', async () => {
      const response = await request(app)
        .get('/api/products/manufacturers')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/products/origins', () => {
    test('should return list of countries of origin', async () => {
      const response = await request(app)
        .get('/api/products/origins')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/products/categories', () => {
    test('should return list of categories', async () => {
      const response = await request(app)
        .get('/api/products/categories')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/products', () => {
    const testProduct = {
      name: 'Test EV Charger',
      description: 'A test electric vehicle charger for unit testing',
      cost: 50000,
      category: 'EV Charging Equipment',
      manufacturer: 'Test Corp',
      origin: 'United States',
      rating: '11 kW'
    };

    test('should create a new product with valid data', async () => {
      const response = await request(app)
        .post('/api/products')
        .send(testProduct)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testProduct.name);
      expect(response.body.cost).toBe(testProduct.cost);
      expect(response.body.category).toBe(testProduct.category);
      
      // Save ID for cleanup
      testProductId = response.body.id;
    });

    test('should return 400 for missing required fields', async () => {
      const invalidProduct = {
        name: 'Incomplete Product'
        // Missing required fields
      };

      await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect(400);
    });

    test('should return 400 for invalid price', async () => {
      const invalidProduct = {
        ...testProduct,
        cost: -1000 // Negative cost
      };

      await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect(400);
    });
  });

  describe('PUT /api/products/:id', () => {
    test('should update an existing product', async () => {
      if (!testProductId) {
        // Create a product first if we don't have one
        const createResponse = await request(app)
          .post('/api/products')
          .send({
            name: 'Update Test Product',
            description: 'Product for update testing',
            cost: 1000000,
            category: 'EV Charging Equipment',
            manufacturer: 'Test Corp',
            origin: 'United States',
            rating: '22 kW'
          });
        testProductId = createResponse.body.id;
      }

      const updatedData = {
        name: 'Updated Test EV Charger',
        description: 'Updated description',
        cost: 60000
      };

      const response = await request(app)
        .put(`/api/products/${testProductId}`)
        .send(updatedData)
        .expect(200);
      
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.description).toBe(updatedData.description);
      expect(response.body.cost).toBe(updatedData.cost);
    });

    test('should return 404 for non-existent product', async () => {
      await request(app)
        .put('/api/products/99999')
        .send({
          name: 'Non-existent Product'
        })
        .expect(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    test('should delete an existing product', async () => {
      if (!testProductId) {
        // Create a product first if we don't have one
        const createResponse = await request(app)
          .post('/api/products')
          .send({
            name: 'Delete Test Product',
            description: 'Product for delete testing',
            cost: 1000000,
            category: 'EV Charging Equipment',
            manufacturer: 'Test Corp',
            origin: 'United States',
            rating: '50 kW'
          });
        testProductId = createResponse.body.id;
      }

      await request(app)
        .delete(`/api/products/${testProductId}`)
        .expect(200);
      
      // Verify the product is deleted
      const getResponse = await request(app)
        .get('/api/products')
        .expect(200);
      
      const deletedProduct = getResponse.body.find(p => p.id === testProductId);
      expect(deletedProduct).toBeUndefined();
    });

    test('should return 404 for non-existent product', async () => {
      await request(app)
        .delete('/api/products/99999')
        .expect(404);
    });
  });

  // Cleanup after all tests
  afterAll(async () => {
    // Clean up any remaining test data if needed
    if (testProductId) {
      try {
        await request(app).delete(`/api/products/${testProductId}`);
      } catch (error) {
        // Product might already be deleted
      }
    }
  });
});