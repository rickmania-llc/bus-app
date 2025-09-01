# End-to-End Testing Suite - Quality Assurance

## Directory Purpose
The tests directory contains end-to-end testing infrastructure using Playwright to validate the complete bus transportation tracking application workflow. This testing suite ensures functionality across the React frontend, Firebase Cloud Functions backend, and Electron desktop wrapper, with comprehensive coverage of user interactions, data flows, and multi-tenant scenarios.

## Architecture Overview

### Design Pattern
**End-to-End Testing Pattern**: Full application testing from user interface through backend services to database operations, simulating real user workflows and validating complete feature functionality.

### Component Structure
```
tests/
├── e2e/                         # Playwright end-to-end tests
│   ├── student-management.spec.ts    # Student CRUD testing
│   ├── guardian-management.spec.ts   # Guardian CRUD testing  
│   ├── driver-management.spec.ts     # Driver CRUD testing
│   ├── route-management.spec.ts      # Route CRUD testing
│   └── multi-tenant.spec.ts          # Tenant isolation testing
├── fixtures/                    # Test data and utilities
│   ├── student-data.ts         # Sample student data
│   ├── guardian-data.ts        # Sample guardian data
│   └── test-helpers.ts         # Common test utilities
├── playwright.config.ts        # Playwright configuration
└── CLAUDE.md                   # This documentation file
```

### Dependencies
- **Internal**: Depends on React app, Firebase Functions, and Firebase emulator
- **External**: Playwright testing framework, Firebase emulator suite

## Core Functionality

### Primary Responsibilities
1. **User Interface Testing**: Validate React component interactions and workflows
2. **API Integration Testing**: Test Firebase Cloud Functions through UI interactions  
3. **Data Flow Validation**: Ensure data consistency between frontend, backend, and database
4. **Multi-tenant Testing**: Verify tenant isolation and data separation
5. **Cross-browser Compatibility**: Test application across different browsers
6. **Performance Testing**: Validate application response times and resource usage

### Testing Scope

#### End-to-End Test Coverage
**Purpose**: Comprehensive testing of complete user workflows
**Test Areas**:
- Student management: Create, read, update, delete operations
- Guardian management: Guardian-student relationship handling
- Driver management: Driver profile and assignment operations
- Route management: Route creation with embedded stops
- Real-time synchronization: Firebase listener functionality
- Multi-tenant isolation: Data separation between tenants

## File Descriptions

### playwright.config.ts
**Purpose**: Playwright testing framework configuration
**Key Configuration**:
```typescript
{
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium'
  },
  webServer: {
    command: 'yarn dev',
    port: 5173
  }
}
```

**Features**:
- Automatic React dev server startup
- Multi-browser testing support
- Screenshot capture on failures
- Video recording for debugging

### e2e/student-management.spec.ts
**Purpose**: End-to-end testing of student management functionality
**Test Scenarios**:
- Create new student through UI form
- Validate student appears in student list
- Update student information through edit form
- Verify real-time updates across UI
- Delete student and confirm removal
- Test form validation and error handling

**Example Test Structure**:
```typescript
test('should create new student successfully', async ({ page }) => {
  // Navigate to student management
  await page.goto('/');
  await page.click('[data-testid="students-nav"]');
  
  // Fill student creation form
  await page.fill('[data-testid="student-name"]', 'John Doe');
  await page.fill('[data-testid="student-address"]', '123 Main St');
  
  // Submit and verify
  await page.click('[data-testid="create-student-btn"]');
  await expect(page.locator('[data-testid="student-list"]')).toContainText('John Doe');
});
```

### e2e/guardian-management.spec.ts
**Purpose**: Testing guardian management with student relationship handling
**Test Scenarios**:
- Create guardian with student assignments
- Test primary guardian designation
- Verify guardian-student relationship bidirectionality
- Update guardian information and relationships
- Delete guardian and verify cleanup

### e2e/multi-tenant.spec.ts
**Purpose**: Validate multi-tenant data isolation
**Test Scenarios**:
- Create data in different tenant contexts
- Verify data isolation between tenants
- Test tenant header validation
- Confirm no cross-tenant data leakage
- Validate tenant-specific database connections

### fixtures/test-helpers.ts
**Purpose**: Common utilities and helper functions for tests
**Exports**:
- `createTestStudent()`: Generate test student data
- `createTestGuardian()`: Generate test guardian data
- `setupFirebaseEmulator()`: Initialize emulator for testing
- `cleanupTestData()`: Clear test data after tests
- `waitForRealtimeUpdate()`: Wait for Firebase real-time updates

**Key Functions**:
```typescript
export async function createTestStudent(page: Page): Promise<Student> {
  const studentData = {
    name: `Test Student ${Date.now()}`,
    dob: new Date('2010-01-01').getTime(),
    address: '123 Test Street',
    pictureUrl: 'https://example.com/test.jpg'
  };
  
  // Create through UI and return created student
  await fillStudentForm(page, studentData);
  await page.click('[data-testid="create-student-btn"]');
  
  return studentData;
}
```

## Testing Approach

### Test Strategy
- **User-Centric Testing**: Focus on real user workflows and interactions
- **Data-Driven Testing**: Use realistic test data that mirrors production scenarios
- **Integration Testing**: Validate complete stack integration from UI to database
- **Isolation Testing**: Ensure tests don't interfere with each other
- **Parallel Execution**: Run tests concurrently for faster feedback

### Test Environment Setup
```typescript
// Before each test
beforeEach(async () => {
  // Start Firebase emulators
  await setupFirebaseEmulator();
  
  // Clear any existing test data
  await cleanupTestData();
  
  // Set test tenant context
  await setTestTenant('test-tenant');
});

// After each test
afterEach(async () => {
  // Clean up test data
  await cleanupTestData();
  
  // Stop emulators if needed
  await teardownEmulators();
});
```

### Test Data Management
- **Isolated Test Data**: Each test creates its own data to prevent interference
- **Realistic Data**: Use data that closely resembles real-world usage
- **Cleanup Strategy**: Automatic cleanup after each test to maintain isolation
- **Fixture Management**: Reusable test data generators for consistency

## Configuration

### Playwright Configuration
```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox', 
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
});
```

### Firebase Emulator Integration
- **Database Emulator**: Port 9000 for Realtime Database testing
- **Functions Emulator**: Port 5001 for Cloud Functions testing
- **Auth Emulator**: Port 9099 for Authentication testing (future)
- **Data Import/Export**: Consistent test data across test runs

## Performance Testing

### Response Time Validation
```typescript
test('should load student list within 2 seconds', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/students');
  await page.waitForSelector('[data-testid="student-list"]');
  
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(2000);
});
```

### Memory Usage Monitoring
- Monitor for memory leaks in long-running tests
- Validate Firebase listener cleanup
- Check for DOM element accumulation
- Monitor network request patterns

## Error Handling Testing

### Error Scenario Validation
```typescript
test('should handle network errors gracefully', async ({ page }) => {
  // Simulate network failure
  await page.route('**/studentCrud', route => route.abort());
  
  // Attempt to create student
  await createTestStudent(page);
  
  // Verify error message is displayed
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
});
```

### Edge Case Testing
- Test with invalid input data
- Simulate network connectivity issues  
- Test Firebase emulator disconnection scenarios
- Validate form validation error handling
- Test concurrent user operations

## Integration Testing

### Firebase Integration Validation
```typescript
test('should sync data in real-time across multiple browser tabs', async ({ 
  browser 
}) => {
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();
  
  // Navigate both to student list
  await page1.goto('/students');
  await page2.goto('/students');
  
  // Create student in first tab
  await createTestStudent(page1);
  
  // Verify student appears in second tab automatically
  await expect(page2.locator('[data-testid="student-list"]'))
    .toContainText('Test Student');
});
```

### Multi-tenant Integration
- Test tenant header validation
- Verify data isolation between tenants
- Validate tenant-specific database operations
- Test tenant switching functionality (future feature)

## Test Utilities

### Custom Test Fixtures
```typescript
// Custom test fixture for authenticated user
export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    // Set up authentication context
    await page.addInitScript(() => {
      window.localStorage.setItem('tenant', 'test-tenant');
    });
    
    await page.goto('/');
    await use(page);
  }
});
```

### Test Data Generators
```typescript
export class TestDataGenerator {
  static generateStudent(overrides?: Partial<Student>): Omit<Student, 'id' | 'createdAt'> {
    return {
      name: `Test Student ${Math.random().toString(36).substr(2, 9)}`,
      dob: new Date('2010-01-01').getTime(),
      address: '123 Test Street, Test City, TC 12345',
      pictureUrl: 'https://example.com/test-student.jpg',
      ...overrides
    };
  }
  
  static generateGuardian(studentIds: string[] = []): Omit<Guardian, 'id' | 'createdAt'> {
    const students: { [key: string]: { reference: true; isPrimaryGuardian: boolean } } = {};
    studentIds.forEach((id, index) => {
      students[id] = {
        reference: true,
        isPrimaryGuardian: index === 0
      };
    });
    
    return {
      name: `Test Guardian ${Math.random().toString(36).substr(2, 9)}`,
      govId: `${Math.random().toString().substr(2, 9)}`,
      pictureUrl: null,
      students
    };
  }
}
```

## Debugging and Diagnostics

### Test Debugging Tools
- **Visual Debugging**: Screenshots and videos on test failures
- **Step-by-step Debugging**: Playwright inspector for interactive debugging
- **Console Logging**: Capture browser console logs during test execution
- **Network Monitoring**: Track HTTP requests and responses during tests

### Debugging Configuration
```typescript
// Enable debug mode for local development
if (process.env.DEBUG) {
  test.use({
    headless: false,
    slowMo: 1000,
    video: 'on',
    screenshot: 'on'
  });
}
```

## Continuous Integration

### CI/CD Integration
- **GitHub Actions**: Automated test execution on pull requests
- **Firebase Emulator**: Automated emulator startup in CI environment
- **Test Reports**: HTML test reports generated and published
- **Failure Notifications**: Automated notifications for test failures

### CI Configuration Requirements
```yaml
# GitHub Actions example
- name: Install dependencies
  run: yarn install

- name: Start Firebase emulators
  run: yarn emulators &
  
- name: Wait for emulators
  run: sleep 10

- name: Run E2E tests
  run: yarn test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v2
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Best Practices

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names that explain the scenario
- Keep tests focused on single functionality
- Maintain test independence and isolation

### Data Management
- Create fresh test data for each test
- Clean up test data after each test
- Use realistic test data that mirrors production scenarios
- Avoid hardcoded IDs or timestamps that might cause flakiness

### Assertion Strategy
- Use specific, meaningful assertions
- Wait for elements to be available before asserting
- Test both positive and negative scenarios
- Validate both UI state and underlying data

## Common Commands

### Development Testing
```bash
# Run all end-to-end tests
yarn test:e2e

# Run tests with UI mode for debugging
yarn test:e2e:ui

# Run tests in debug mode
yarn test:e2e:debug

# Run specific test file
yarn test:e2e student-management.spec.ts

# Run tests in headed mode (visible browser)
yarn test:e2e --headed
```

### CI/Production Testing
```bash
# Run tests with retries for CI
yarn test:e2e --retries=2

# Generate HTML report
yarn test:e2e --reporter=html

# Run tests in parallel across multiple workers
yarn test:e2e --workers=4

# Run tests with specific browser
yarn test:e2e --project=chromium
```

### Test Development
```bash
# Generate test code from browser interactions
npx playwright codegen http://localhost:5173

# Update Playwright browsers
npx playwright install

# Show test report
npx playwright show-report
```

---

**Note**: This testing documentation is part of the comprehensive CLAUDE.md network. Keep it updated when adding new test scenarios, changing test infrastructure, or modifying application functionality that requires test updates.