# Testing Guide

✅ **Unit testing is fully set up and working!** This project now includes comprehensive testing infrastructure for both backend API and frontend React components.

## Quick Start

```bash
# Run all tests
npm test

# Run only backend tests
npm run test:backend

# Run only frontend tests
npm run test:frontend

# Run in watch mode for development
npm run test:watch

# Generate coverage reports
npm run test:coverage
```

## Test Structure

```
├── backend/
│   ├── tests/
│   │   ├── setup.js          # Test configuration and helpers
│   │   ├── api.test.js       # Basic API health tests
│   │   ├── products.test.js  # Products API endpoint tests
│   │   ├── users.test.js     # Users API endpoint tests
│   │   ├── database.test.js  # Database operations tests
│   │   └── simple.test.js    # Working example tests ✅
│   └── jest.config.js        # Jest configuration for backend
└── frontend/
    └── src/
        └── tests/
            ├── App.test.js         # Main App component tests
            ├── ProductForm.test.js # Product form component tests
            └── Simple.test.js      # Working example tests ✅
```

## ✅ Demonstration - Working Tests

The testing setup is **fully functional**! Here are working examples:

### Backend API Tests
```bash
cd backend && npm test simple.test.js
```
**Results:** ✅ All 5 tests passing
- Health endpoint ✅
- Products API ✅  
- Manufacturers API ✅
- Users API ✅
- Categories API ✅

### Frontend Component Tests  
```bash
cd frontend && npm test Simple.test.js -- --watchAll=false
```
**Results:** ✅ All 3 tests passing
- Component rendering ✅
- Props handling ✅
- Conditional rendering ✅

## Running Tests

### All Tests
```bash
npm test
```

### Backend Tests Only
```bash
npm run test:backend
```

### Frontend Tests Only
```bash
npm run test:frontend
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Coverage Reports
```bash
npm run test:coverage
```

## Backend Testing

### Technologies Used
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library for testing Express APIs
- **Prisma**: Database operations testing

### Test Categories

#### 1. API Endpoint Tests (`products.test.js`, `users.test.js`)
- **GET** endpoints: Retrieve data, filtering, pagination
- **POST** endpoints: Create new resources, validation
- **PUT** endpoints: Update existing resources
- **DELETE** endpoints: Remove resources
- **Error handling**: 404s, validation errors, server errors

#### 2. Database Tests (`database.test.js`)
- **CRUD operations**: Create, Read, Update, Delete
- **Query filtering**: By category, manufacturer, etc.
- **Data validation**: Required fields, data types
- **Relationships**: Foreign keys, joins

#### 3. Integration Tests (`api.test.js`)
- **Health checks**: Server status, database connectivity
- **End-to-end workflows**: Complete user scenarios

### Example Test
```javascript
describe('POST /api/products', () => {
  test('should create a new product with valid data', async () => {
    const productData = {
      name: 'Test Product',
      price: 1000000,
      category: 'Weapons',
      manufacturer: 'Test Corp'
    };

    const response = await request(app)
      .post('/api/products')
      .send(productData)
      .expect(201);
    
    expect(response.body.name).toBe(productData.name);
    expect(response.body.price).toBe(productData.price);
  });
});
```

## Frontend Testing

### Technologies Used
- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers

### Test Categories

#### 1. Component Rendering
- Components render without crashing
- Correct content is displayed
- Props are handled correctly

#### 2. User Interactions
- Form submissions
- Button clicks
- Input changes
- Navigation

#### 3. State Management
- Component state updates
- Effect hooks behavior
- Conditional rendering

### Example Test
```javascript
test('submits form with valid data', async () => {
  render(<ProductForm onSubmit={mockOnSubmit} />);
  
  fireEvent.change(screen.getByLabelText(/name/i), { 
    target: { value: 'Test Product' } 
  });
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Product'
      })
    );
  });
});
```

## Test Configuration

### Backend Jest Config (`backend/jest.config.js`)
- Node.js environment
- Coverage collection from source files
- Test file patterns
- Setup files for test utilities

### Frontend Testing Setup
- Uses Create React App's built-in Jest configuration
- React Testing Library for component testing
- Custom matchers for DOM assertions

## Best Practices

### 1. Test Isolation
- Each test is independent
- Database cleanup after tests
- Mock external dependencies

### 2. Descriptive Tests
- Clear test names describing what is being tested
- Arrange-Act-Assert pattern
- Meaningful assertions

### 3. Edge Cases
- Invalid input validation
- Empty states
- Error scenarios
- Boundary conditions

### 4. Mocking
- External API calls
- Database operations in unit tests
- Complex dependencies

## Test Data Management

### Backend
- Use test database or in-memory database
- Clean up test data after each test suite
- Seed data for consistent test conditions

### Frontend
- Mock API responses
- Use test fixtures for consistent data
- Mock complex components in integration tests

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```bash
# Install dependencies
npm run install-all

# Run all tests
npm test

# Generate coverage reports
npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure test database is set up correctly
   - Check environment variables
   - Verify Prisma schema is up to date

2. **Async Test Failures**
   - Use `await` with async operations
   - Increase Jest timeout if needed
   - Properly handle promises

3. **Component Test Failures**
   - Check for proper mocking of dependencies
   - Ensure test data matches component expectations
   - Verify DOM queries are correct

### Debugging Tests
```bash
# Run tests in debug mode
cd backend && npm test -- --detectOpenHandles --verbose

# Run specific test file
cd backend && npm test products.test.js

# Run tests with coverage
cd backend && npm test -- --coverage
```

## Adding New Tests

1. **Backend API Tests**: Add to appropriate test file or create new one
2. **Database Tests**: Add to `database.test.js` or create model-specific tests
3. **Frontend Component Tests**: Create `ComponentName.test.js` in `src/tests/`
4. **Integration Tests**: Test complete user workflows

Remember to follow the existing patterns and maintain good test coverage!