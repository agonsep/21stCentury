const request = require('supertest');
const app = require('../server');

describe('Users API', () => {
  let testUserId;

  describe('GET /api/users', () => {
    test('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      
      // Check if response has expected user structure
      if (response.body.length > 0) {
        const user = response.body[0];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('createdAt');
      }
    });
  });

  describe('POST /api/users', () => {
    const testUser = {
      name: 'John Doe',
      email: 'john.doe.test@example.com'
    };

    test('should create a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(testUser)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testUser.name);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body).toHaveProperty('createdAt');
      
      // Save ID for cleanup
      testUserId = response.body.id;
    });

    test('should return 400 for missing name', async () => {
      const invalidUser = {
        email: 'missing.name@example.com'
        // Missing name
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Name and email are required');
    });

    test('should return 400 for missing email', async () => {
      const invalidUser = {
        name: 'Missing Email'
        // Missing email
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Name and email are required');
    });

    test('should return 400 for empty name', async () => {
      const invalidUser = {
        name: '',
        email: 'empty.name@example.com'
      };

      await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
    });

    test('should return 400 for empty email', async () => {
      const invalidUser = {
        name: 'Empty Email',
        email: ''
      };

      await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
    });

    test('should handle duplicate email gracefully', async () => {
      // Create first user
      const user1 = {
        name: 'First User',
        email: 'duplicate@example.com'
      };
      
      await request(app)
        .post('/api/users')
        .send(user1)
        .expect(201);

      // Try to create second user with same email
      const user2 = {
        name: 'Second User',
        email: 'duplicate@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(user2);
      
      // Should either return 400 (validation error) or 500 (server error for duplicate)
      expect([400, 409, 500]).toContain(response.status);
    });
  });

  // Cleanup after all tests
  afterAll(async () => {
    // Note: In a real test environment, you'd want to clean up test data
    // This might involve deleting test users or using a test database
    // For now, we'll leave this as a placeholder
  });
});