// Test setup file
require('dotenv').config({ path: '.env.test' });

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  // Clean up any test data if needed
});

// Global test helpers
global.testHelper = {
  // Helper functions can be added here
};