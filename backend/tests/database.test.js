const { PrismaClient } = require('@prisma/client');
const { initializeDatabase, seedDatabase } = require('../database');

describe('Database Operations', () => {
  let prisma;

  beforeAll(async () => {
    // Create a test instance of PrismaClient
    prisma = new PrismaClient();
    
    // Initialize test database
    try {
      await initializeDatabase();
    } catch (error) {
      console.log('Database already initialized or error:', error.message);
    }
  });

  afterAll(async () => {
    // Clean up and disconnect
    await prisma.$disconnect();
  });

  describe('Database Connection', () => {
    test('should connect to database successfully', async () => {
      // Test database connection
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      expect(result).toBeDefined();
      expect(result[0]).toHaveProperty('test', 1n); // SQLite returns BigInt
    });
  });

  describe('User Operations', () => {
    let testUserId;

    test('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test.database@example.com'
      };

      const user = await prisma.user.create({
        data: userData
      });

      expect(user).toHaveProperty('id');
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user).toHaveProperty('createdAt');

      testUserId = user.id;
    });

    test('should find user by id', async () => {
      if (!testUserId) {
        const user = await prisma.user.create({
          data: {
            name: 'Find Test User',
            email: 'find.test@example.com'
          }
        });
        testUserId = user.id;
      }

      const foundUser = await prisma.user.findUnique({
        where: { id: testUserId }
      });

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(testUserId);
    });

    test('should find user by email', async () => {
      const email = 'email.search@example.com';
      
      await prisma.user.create({
        data: {
          name: 'Email Search User',
          email: email
        }
      });

      const foundUser = await prisma.user.findUnique({
        where: { email: email }
      });

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe(email);
    });

    test('should return null for non-existent user', async () => {
      const foundUser = await prisma.user.findUnique({
        where: { id: 99999 }
      });

      expect(foundUser).toBeNull();
    });

    test('should list all users', async () => {
      const users = await prisma.user.findMany();
      
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    // Clean up test user
    afterAll(async () => {
      if (testUserId) {
        try {
          await prisma.user.delete({
            where: { id: testUserId }
          });
        } catch (error) {
          // User might already be deleted
        }
      }
    });
  });

  describe('Product Operations', () => {
    let testProductId;

    test('should create a new product', async () => {
      const productData = {
        name: 'Test Database Product',
        description: 'A product for testing database operations',
        cost: 1000000,
        category: 'Weapons',
        manufacturer: 'Test Manufacturing Corp',
        origin: 'United States',
        rating: '5 stars'
      };

      const product = await prisma.product.create({
        data: productData
      });

      expect(product).toHaveProperty('id');
      expect(product.name).toBe(productData.name);
      expect(product.cost).toBe(productData.cost);
      expect(product.category).toBe(productData.category);

      testProductId = product.id;
    });

    test('should find product by id', async () => {
      if (!testProductId) {
        const product = await prisma.product.create({
          data: {
            name: 'Find Test Product',
            description: 'Product for find testing',
            cost: 500000,
            category: 'Weapons',
            manufacturer: 'Test Corp',
            origin: 'United States',
            rating: '4 stars'
          }
        });
        testProductId = product.id;
      }

      const foundProduct = await prisma.product.findUnique({
        where: { id: testProductId }
      });

      expect(foundProduct).toBeDefined();
      expect(foundProduct.id).toBe(testProductId);
    });

    test('should find products by category', async () => {
      const products = await prisma.product.findMany({
        where: { category: 'Weapons' }
      });

      expect(Array.isArray(products)).toBe(true);
      products.forEach(product => {
        expect(product.category).toBe('Weapons');
      });
    });

    test('should find products by manufacturer', async () => {
      const manufacturer = 'Test Manufacturing Corp';
      const products = await prisma.product.findMany({
        where: { manufacturer: manufacturer }
      });

      expect(Array.isArray(products)).toBe(true);
      products.forEach(product => {
        expect(product.manufacturer).toBe(manufacturer);
      });
    });

    test('should update product', async () => {
      if (!testProductId) {
        const product = await prisma.product.create({
          data: {
            name: 'Update Test Product',
            description: 'Product for update testing',
            cost: 500000,
            category: 'Weapons',
            manufacturer: 'Test Corp',
            origin: 'United States',
            rating: '3 stars'
          }
        });
        testProductId = product.id;
      }

      const updateData = {
        name: 'Updated Test Product',
        cost: 1500000
      };

      const updatedProduct = await prisma.product.update({
        where: { id: testProductId },
        data: updateData
      });

      expect(updatedProduct.name).toBe(updateData.name);
      expect(updatedProduct.cost).toBe(updateData.cost);
    });

    test('should delete product', async () => {
      if (!testProductId) {
        const product = await prisma.product.create({
          data: {
            name: 'Delete Test Product',
            description: 'Product for delete testing',
            cost: 500000,
            category: 'Weapons',
            manufacturer: 'Test Corp',
            origin: 'United States',
            rating: '2 stars'
          }
        });
        testProductId = product.id;
      }

      await prisma.product.delete({
        where: { id: testProductId }
      });

      const deletedProduct = await prisma.product.findUnique({
        where: { id: testProductId }
      });

      expect(deletedProduct).toBeNull();
      testProductId = null; // Reset so cleanup doesn't try to delete again
    });

    // Clean up test product
    afterAll(async () => {
      if (testProductId) {
        try {
          await prisma.product.delete({
            where: { id: testProductId }
          });
        } catch (error) {
          // Product might already be deleted
        }
      }
    });
  });
});