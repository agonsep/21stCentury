const request = require('supertest');
const app = require('../server');

describe('Simple API Tests - Working Examples', () => {
  test('Health endpoint works correctly', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('Products endpoint returns data', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Manufacturers endpoint returns data', async () => {
    const response = await request(app)
      .get('/api/products/manufacturers')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Users endpoint returns data', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Categories endpoint returns data', async () => {
    const response = await request(app)
      .get('/api/products/categories')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });
});