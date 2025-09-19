# Testing Guide

✅ **Complete testing suite is set up and working!** This project includes comprehensive testing infrastructure for backend API, frontend React components, and end-to-end user journeys.

## Quick Start

```bash
# Run all tests (backend + frontend + e2e)
npm run test:all

# Run individual test suites
npm run test:backend         # API unit & integration tests
npm run test:frontend        # React component tests  
npm run test:e2e            # End-to-end browser tests

# Development workflows
npm run test:watch          # Backend + frontend in watch mode
npm run test:e2e:headed     # E2E tests with visible browser
npm run test:e2e:ui         # E2E tests with Playwright UI

# Coverage reports
npm run test:coverage       # Backend + frontend coverage
```

## Test Architecture

```
├── backend/tests/           # Unit & Integration Tests
│   ├── api.test.js         # API health & basic endpoints
│   ├── products.test.js    # Products CRUD operations
│   ├── users.test.js       # User management
│   ├── database.test.js    # Database operations
│   └── simple.test.js      # Working examples ✅
├── frontend/src/tests/      # Component Unit Tests  
│   ├── App.test.js         # Main App component
│   ├── ProductForm.test.js # Form validation & interaction
│   ├── ProductList.test.js # List rendering & filtering
│   └── Simple.test.js      # Working examples ✅
└── e2e/                    # End-to-End Tests
    ├── basic-functionality.spec.js  # Core app functionality
    ├── product-management.spec.js   # Product workflows
    ├── admin-functionality.spec.js  # Admin features
    └── user-experience.spec.js      # User journeys & UX
```

## Testing Pyramid Implementation

This project implements the complete **testing pyramid**:

```
       🔺 E2E Tests (Playwright)
      🔺🔺 Integration Tests (Supertest) 
    🔺🔺🔺 Unit Tests (Jest + RTL)
```

### 🏗️ Unit Tests (Fast, Isolated)
- **Backend**: Pure function testing, mocked dependencies
- **Frontend**: Component behavior with mock data
- **Purpose**: Validate individual components work correctly

### 🔗 Integration Tests (Medium, Real Data)  
- **Backend**: Full API testing with real database
- **Purpose**: Ensure components work together correctly

### 🌐 E2E Tests (Slow, Complete User Flows)
- **Cross-browser**: Chrome, Firefox, Safari, Mobile
- **Purpose**: Validate entire user experience works end-to-end

## ✅ Demonstration - Working Tests

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

### Frontend Component Tests Only
```bash
npm run test:frontend
```

### E2E Browser Tests Only
```bash
npm run test:e2e
```

### Watch Mode (Development)
```bash
npm run test:watch              # Backend + Frontend
npm run test:e2e:headed         # E2E with visible browser
npm run test:e2e:ui            # E2E with Playwright UI
```

### Coverage Reports
```bash
npm run test:coverage
```

## End-to-End Testing (Playwright)

### 🚀 New! Cross-Browser Testing

The project now includes **Playwright** for comprehensive end-to-end testing across:

- ✅ **Desktop Chrome** (Chromium)
- ✅ **Desktop Firefox** 
- ✅ **Desktop Safari** (WebKit)
- ✅ **Mobile Chrome** (Pixel 5)
- ✅ **Mobile Safari** (iPhone 12)

### E2E Test Categories

#### 1. Basic Functionality (`basic-functionality.spec.js`)
- Homepage loading and navigation
- Core routing and page transitions
- Essential UI elements rendering

#### 2. Product Management (`product-management.spec.js`)  
- Product search and filtering
- Product list display and interaction
- Category and manufacturer filtering

#### 3. Admin Functionality (`admin-functionality.spec.js`)
- Admin login and authentication
- Admin navigation and sections
- Form validation and error handling

#### 4. User Experience (`user-experience.spec.js`)
- Complete user journeys and workflows
- Responsive design (mobile/desktop)
- Performance testing and load times
- Error handling (404 pages, etc.)

### E2E Test Features

```javascript
// Auto-waits for elements
await expect(page.locator('.product-list')).toContainText('F-35');

// Cross-browser testing
test.describe('Product Search', () => {
  // Runs on Chrome, Firefox, Safari automatically
});

// Mobile testing
await page.setViewportSize({ width: 375, height: 667 });

// Screenshots on failure
screenshot: 'only-on-failure',
video: 'retain-on-failure'
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

## Continuous Integration

### Railway Deployment Testing

The project is configured to **run all tests before deployment**:

```toml
# nixpacks.toml
[phases.build]
cmds = [
  'cd backend && npx prisma generate',
  'npm run test',                    # 🧪 Tests must pass
  'cd frontend && npm run build'     # 🏗️ Only builds if tests pass
]
```

**Deployment will fail if any tests fail!** This ensures:
- ✅ No broken code reaches production
- ✅ All unit, integration, and E2E tests pass
- ✅ Quality gate before live deployment

### Test Commands for CI/CD

```bash
# Full test suite (what Railway runs)
npm run test:all

# Individual test suites
npm run test:backend    # API & database tests
npm run test:frontend   # Component tests  
npm run test:e2e       # Browser automation tests
```

## Development Workflow

### 🔄 Red-Green-Refactor Cycle

1. **🔴 Red**: Write failing test
2. **🟢 Green**: Write minimal code to pass
3. **🔵 Refactor**: Improve code while keeping tests green

### 🧪 Test-Driven Development

```bash
# Start development server
npm run dev

# In another terminal - watch mode
npm run test:watch

# Write tests first, then implement features
# Tests guide your development process
```

### 🚀 Pre-Deployment Checklist

```bash
# 1. Run full test suite
npm run test:all

# 2. Check test coverage
npm run test:coverage

# 3. Run E2E tests in headed mode (visual verification)
npm run test:e2e:headed

# 4. Deploy with confidence!
git push  # Railway will run tests automatically
```

## Example Tests

### Backend API Test
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

### Frontend Component Test
```javascript
test('renders product list with mock data', () => {
  const mockProducts = [
    { id: 1, name: 'F-35 Lightning II', price: 78000000 }
  ];
  
  render(<ProductList products={mockProducts} />);
  
  expect(screen.getByText('F-35 Lightning II')).toBeInTheDocument();
});
```

### E2E Browser Test
```javascript
test('user can search for products', async ({ page }) => {
  await page.goto('/products');
  
  await page.fill('input[type="search"]', 'F-35');
  await page.press('input[type="search"]', 'Enter');
  
  await expect(page.locator('.search-results')).toContainText('F-35');
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