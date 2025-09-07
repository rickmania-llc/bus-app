# Firebase Functions Unit Testing Guide

## Overview

This guide provides a comprehensive approach to implementing unit testing for Firebase Cloud Functions in the Bus Transportation Tracking Application. It covers testing setup, strategies, patterns, and practical examples specific to our multi-tenant CRUD architecture.

## Table of Contents

1. [Testing Fundamentals](#testing-fundamentals)
2. [Setup and Configuration](#setup-and-configuration)
3. [Testing Strategies](#testing-strategies)
4. [Implementation Guide](#implementation-guide)
5. [Test Examples](#test-examples)
6. [Best Practices](#best-practices)
7. [CI/CD Integration](#cicd-integration)

## Testing Fundamentals

### What is Firebase Functions Unit Testing?

Firebase Functions unit testing allows you to test your Cloud Functions in isolation, without deploying them to Firebase or making actual network requests. This enables:
- Fast feedback loops during development
- Confidence in code changes
- Regression prevention
- Documentation through test cases

### Key Components

1. **firebase-functions-test SDK**: Official testing library from Firebase
2. **Test Runner**: Mocha (recommended) or Jest
3. **Assertion Library**: Chai or built-in Node.js assertions
4. **Mocking Tools**: Sinon for stubbing external dependencies
5. **Test Modes**:
   - **Offline Mode**: Completely isolated, no external connections
   - **Online Mode**: Connects to a test Firebase project

## Setup and Configuration

### Step 1: Install Testing Dependencies

```bash
cd functions
yarn add -D firebase-functions-test mocha chai sinon @types/mocha @types/chai @types/sinon
```

### Step 2: Update package.json

Add test scripts to your `functions/package.json`:

```json
{
  "scripts": {
    "test": "mocha --recursive --require ts-node/register --timeout 10000 'test/**/*.test.ts'",
    "test:watch": "mocha --recursive --require ts-node/register --watch --watch-files src,test 'test/**/*.test.ts'",
    "test:coverage": "nyc mocha --recursive --require ts-node/register --timeout 10000 'test/**/*.test.ts'"
  }
}
```

### Step 3: Create Test Directory Structure

```
functions/
├── src/
│   └── ... (existing source files)
├── test/
│   ├── setup.ts              # Test configuration and setup
│   ├── fixtures/             # Test data and mock objects
│   │   ├── students.ts
│   │   ├── guardians.ts
│   │   ├── drivers.ts
│   │   └── routes.ts
│   ├── unit/                 # Unit tests
│   │   ├── api/
│   │   │   ├── students/
│   │   │   │   ├── index.test.ts
│   │   │   │   └── crudLogic.test.ts
│   │   │   ├── guardians/
│   │   │   ├── drivers/
│   │   │   └── routes/
│   │   └── index.test.ts
│   └── integration/          # Integration tests
│       └── ... (future)
```

### Step 4: Create Test Setup File

Create `functions/test/setup.ts`:

```typescript
import * as firebaseTest from 'firebase-functions-test';

// Initialize the firebase-functions-test SDK
// Use offline mode for unit tests (no Firebase project connection)
export const test = firebaseTest({
  projectId: 'test-project',
}, './service-account-key.json'); // Optional: path to service account for online mode

// Clean up function to be called after all tests
export const cleanup = () => test.cleanup();

// Mock Firebase Admin initialization
import * as admin from 'firebase-admin';

// Prevent actual Firebase Admin initialization in tests
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'test-project',
  });
}

// Export commonly used test utilities
export { expect } from 'chai';
export { stub, spy, restore } from 'sinon';
```

## Testing Strategies

### 1. Unit Testing Strategy

Focus on testing individual functions in isolation:
- Mock all external dependencies (database, auth, etc.)
- Test business logic separately from HTTP handling
- Verify input validation and error handling
- Test edge cases and boundary conditions

### 2. Multi-Tenant Testing Strategy

Ensure proper tenant isolation:
- Test tenant header validation
- Verify database URL construction
- Test cross-tenant data isolation
- Validate tenant-specific operations

### 3. CRUD Operation Testing Pattern

For each CRUD operation, test:
- **Create**: Validation, ID generation, database writes
- **Read**: Query construction, data retrieval
- **Update**: Partial updates, validation, constraints
- **Delete**: Cascading deletes, relationship cleanup

## Implementation Guide

### Testing HTTP Functions

Example structure for testing HTTP Cloud Functions:

```typescript
import { expect } from 'chai';
import * as sinon from 'sinon';
import { test } from '../../setup';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

describe('Student CRUD HTTP Function', () => {
  let myFunctions: any;
  let adminStub: sinon.SinonStub;

  before(() => {
    // Import your functions after test setup
    myFunctions = require('../../../src/index');
  });

  beforeEach(() => {
    // Stub Firebase Admin methods
    adminStub = sinon.stub(admin, 'database');
  });

  afterEach(() => {
    // Restore all stubs after each test
    sinon.restore();
  });

  it('should create a student with valid data', async () => {
    // Arrange: Create mock request and response
    const req = {
      method: 'POST',
      headers: { tenant: 'test-tenant' },
      body: {
        name: 'John Doe',
        dob: 631152000000,
        address: '123 Main St',
        pictureUrl: 'https://example.com/photo.jpg'
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      set: sinon.stub().returnsThis()
    };

    // Mock database operations
    const mockRef = {
      orderByChild: sinon.stub().returnsThis(),
      equalTo: sinon.stub().returnsThis(),
      once: sinon.stub().resolves({ val: () => null }),
      update: sinon.stub().resolves()
    };

    adminStub.returns({
      ref: sinon.stub().returns(mockRef)
    });

    // Act: Call the function
    await myFunctions.studentCrud(req, res);

    // Assert: Verify the response
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property('message');
    expect(mockRef.update.calledOnce).to.be.true;
  });
});
```

### Testing Business Logic Functions

Example for testing CRUD logic:

```typescript
import { expect } from 'chai';
import * as sinon from 'sinon';
import { createStudent, updateStudent, deleteStudent } from '../../../src/api/students/crudLogic';
import { Request } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

describe('Student CRUD Logic', () => {
  describe('createStudent', () => {
    it('should validate required fields', async () => {
      const req = {
        body: {
          name: 'Test Student',
          // Missing dob and address
        }
      } as Request;

      const mockRef = {} as admin.database.Reference;

      const result = await createStudent(req, mockRef);

      expect(result.success).to.be.false;
      expect(result.message).to.include('Missing required field');
    });

    it('should parse date of birth correctly', async () => {
      const req = {
        body: {
          name: 'Test Student',
          dob: '01/26/1981',
          address: '123 Test St'
        }
      } as Request;

      const mockRef = {
        orderByChild: sinon.stub().returnsThis(),
        equalTo: sinon.stub().returnsThis(),
        once: sinon.stub().resolves({ val: () => null }),
        update: sinon.stub().resolves()
      } as any;

      const result = await createStudent(req, mockRef);

      expect(result.success).to.be.true;
      expect(mockRef.update.calledOnce).to.be.true;
      
      // Verify the timestamp was set correctly
      const updateCall = mockRef.update.firstCall.args[0];
      const studentData = Object.values(updateCall)[0] as any;
      expect(studentData.dob).to.equal(349315200000);
    });

    it('should generate unique student IDs', async () => {
      const req = {
        body: {
          name: 'Test Student',
          dob: 631152000000,
          address: '123 Test St'
        }
      } as Request;

      const mockRef = {
        orderByChild: sinon.stub().returnsThis(),
        equalTo: sinon.stub().returnsThis(),
        once: sinon.stub().resolves({ val: () => null }),
        update: sinon.stub().resolves()
      } as any;

      await createStudent(req, mockRef);

      const updateCall = mockRef.update.firstCall.args[0];
      const studentId = Object.keys(updateCall)[0];
      
      expect(studentId).to.match(/^STU[a-z0-9]{5}[a-f0-9]+$/);
    });

    it('should prevent duplicate names', async () => {
      const req = {
        body: {
          name: 'Existing Student',
          dob: 631152000000,
          address: '123 Test St'
        }
      } as Request;

      const mockRef = {
        orderByChild: sinon.stub().returnsThis(),
        equalTo: sinon.stub().returnsThis(),
        once: sinon.stub().resolves({ 
          val: () => ({ 'STU123': { name: 'Existing Student' } })
        })
      } as any;

      const result = await createStudent(req, mockRef);

      expect(result.success).to.be.false;
      expect(result.message).to.equal('Student name is not unique');
    });
  });

  describe('updateStudent', () => {
    it('should update only provided fields', async () => {
      const req = {
        params: ['STU123'],
        body: {
          address: 'New Address'
        }
      } as any;

      const mockRef = {
        orderByKey: sinon.stub().returnsThis(),
        equalTo: sinon.stub().returnsThis(),
        once: sinon.stub().resolves({
          val: () => ({
            'STU123': {
              name: 'Test Student',
              dob: 631152000000,
              address: 'Old Address'
            }
          })
        }),
        child: sinon.stub().returnsThis(),
        update: sinon.stub().resolves()
      } as any;

      const result = await updateStudent(req, mockRef);

      expect(result.success).to.be.true;
      expect(mockRef.child.calledWith('STU123')).to.be.true;
      expect(mockRef.update.calledWith({ address: 'New Address' })).to.be.true;
    });

    it('should prevent updating createdAt field', async () => {
      const req = {
        params: ['STU123'],
        body: {
          createdAt: Date.now()
        }
      } as any;

      const mockRef = {
        orderByKey: sinon.stub().returnsThis(),
        equalTo: sinon.stub().returnsThis(),
        once: sinon.stub().resolves({
          val: () => ({ 'STU123': {} })
        })
      } as any;

      const result = await updateStudent(req, mockRef);

      expect(result.success).to.be.false;
      expect(result.message).to.equal('Cannot update createdAt field');
    });
  });

  describe('deleteStudent', () => {
    it('should remove student and update guardian references', async () => {
      const req = {
        params: ['STU123']
      } as any;

      const studentRef = {
        orderByKey: sinon.stub().returnsThis(),
        equalTo: sinon.stub().returnsThis(),
        once: sinon.stub().resolves({
          val: () => ({ 'STU123': { name: 'Test Student' } })
        }),
        child: sinon.stub().returnsThis(),
        remove: sinon.stub().resolves()
      } as any;

      const guardianRef = {
        once: sinon.stub().resolves({
          val: () => ({
            'GUARD1': {
              students: {
                'STU123': { isPrimary: true },
                'STU456': { isPrimary: false }
              }
            }
          })
        }),
        update: sinon.stub().resolves()
      } as any;

      const result = await deleteStudent(req, studentRef, guardianRef);

      expect(result.success).to.be.true;
      expect(studentRef.remove.calledOnce).to.be.true;
      expect(guardianRef.update.calledWith({
        'GUARD1/students/STU123': null
      })).to.be.true;
    });
  });
});
```

### Testing Multi-Tenant Functionality

```typescript
describe('Multi-Tenant Database Operations', () => {
  it('should construct correct database URL for tenant', () => {
    const tenant = 'school-district-1';
    const expectedUrl = `https://bus-app-2025-${tenant}.firebaseio.com`;
    
    // Test your database URL construction logic
    const actualUrl = constructDatabaseUrl(tenant);
    
    expect(actualUrl).to.equal(expectedUrl);
  });

  it('should reject requests without tenant header', async () => {
    const req = {
      method: 'POST',
      headers: {}, // Missing tenant header
      body: { /* ... */ }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await myFunctions.studentCrud(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property('message')
      .that.includes('Tenant header is required');
  });
});
```

## Test Examples

### Complete Test File Example

Create `functions/test/unit/api/students/crudLogic.test.ts`:

```typescript
import { expect } from '../../../setup';
import * as sinon from 'sinon';
import { 
  createStudent, 
  updateStudent, 
  deleteStudent,
  removeStudentFromGuardians 
} from '../../../../src/api/students/crudLogic';
import { Request } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

describe('Student CRUD Logic', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Date of Birth Parsing', () => {
    it('should accept Unix timestamp', async () => {
      const req = {
        body: {
          name: 'Test Student',
          dob: 631152000000, // Unix timestamp
          address: '123 Test St'
        }
      } as Request;

      const mockRef = createMockStudentRef(sandbox, null);
      const result = await createStudent(req, mockRef);

      expect(result.success).to.be.true;
      const updateCall = (mockRef.update as sinon.SinonStub).firstCall.args[0];
      const student = Object.values(updateCall)[0] as any;
      expect(student.dob).to.equal(631152000000);
    });

    it('should parse MM/DD/YYYY format', async () => {
      const req = {
        body: {
          name: 'Test Student',
          dob: '01/26/1981',
          address: '123 Test St'
        }
      } as Request;

      const mockRef = createMockStudentRef(sandbox, null);
      const result = await createStudent(req, mockRef);

      expect(result.success).to.be.true;
      const updateCall = (mockRef.update as sinon.SinonStub).firstCall.args[0];
      const student = Object.values(updateCall)[0] as any;
      expect(student.dob).to.equal(349315200000);
    });

    it('should reject invalid date formats', async () => {
      const req = {
        body: {
          name: 'Test Student',
          dob: '26-01-1981', // Invalid format
          address: '123 Test St'
        }
      } as Request;

      const mockRef = createMockStudentRef(sandbox, null);
      const result = await createStudent(req, mockRef);

      expect(result.success).to.be.false;
      expect(result.message).to.include('Date format must be MM/DD/YYYY');
    });

    it('should reject invalid dates like Feb 30', async () => {
      const req = {
        body: {
          name: 'Test Student',
          dob: '02/30/2020', // Invalid date
          address: '123 Test St'
        }
      } as Request;

      const mockRef = createMockStudentRef(sandbox, null);
      const result = await createStudent(req, mockRef);

      expect(result.success).to.be.false;
      expect(result.message).to.include('Invalid date');
    });
  });

  describe('Picture URL Validation', () => {
    it('should accept valid HTTP URLs', async () => {
      const req = {
        body: {
          name: 'Test Student',
          dob: 631152000000,
          address: '123 Test St',
          pictureUrl: 'https://example.com/photo.jpg'
        }
      } as Request;

      const mockRef = createMockStudentRef(sandbox, null);
      const result = await createStudent(req, mockRef);

      expect(result.success).to.be.true;
    });

    it('should reject invalid URLs', async () => {
      const req = {
        body: {
          name: 'Test Student',
          dob: 631152000000,
          address: '123 Test St',
          pictureUrl: 'not-a-url'
        }
      } as Request;

      const mockRef = createMockStudentRef(sandbox, null);
      const result = await createStudent(req, mockRef);

      expect(result.success).to.be.false;
      expect(result.message).to.include('valid HTTP/HTTPS URL');
    });

    it('should allow empty pictureUrl', async () => {
      const req = {
        body: {
          name: 'Test Student',
          dob: 631152000000,
          address: '123 Test St',
          pictureUrl: ''
        }
      } as Request;

      const mockRef = createMockStudentRef(sandbox, null);
      const result = await createStudent(req, mockRef);

      expect(result.success).to.be.true;
      const updateCall = (mockRef.update as sinon.SinonStub).firstCall.args[0];
      const student = Object.values(updateCall)[0] as any;
      expect(student.pictureUrl).to.be.null;
    });
  });

  describe('Guardian Relationship Cleanup', () => {
    it('should remove student from all guardians on delete', async () => {
      const studentId = 'STU123';
      const guardianRef = {
        once: sandbox.stub().resolves({
          val: () => ({
            'GUARD1': {
              students: {
                'STU123': { isPrimary: true },
                'STU456': { isPrimary: false }
              }
            },
            'GUARD2': {
              students: {
                'STU123': { isPrimary: false },
                'STU789': { isPrimary: true }
              }
            }
          })
        }),
        update: sandbox.stub().resolves()
      } as any;

      await removeStudentFromGuardians(studentId, guardianRef);

      expect(guardianRef.update.calledOnce).to.be.true;
      expect(guardianRef.update.firstCall.args[0]).to.deep.equal({
        'GUARD1/students/STU123': null,
        'GUARD2/students/STU123': null
      });
    });
  });
});

// Helper function to create mock database reference
function createMockStudentRef(
  sandbox: sinon.SinonSandbox, 
  existingData: any
): any {
  return {
    orderByChild: sandbox.stub().returnsThis(),
    orderByKey: sandbox.stub().returnsThis(),
    equalTo: sandbox.stub().returnsThis(),
    once: sandbox.stub().resolves({ val: () => existingData }),
    update: sandbox.stub().resolves(),
    child: sandbox.stub().returnsThis(),
    remove: sandbox.stub().resolves()
  };
}
```

### Test Data Fixtures

Create `functions/test/fixtures/students.ts`:

```typescript
import { Student } from '../../common/types';

export const validStudent: Student = {
  name: 'John Doe',
  dob: 631152000000,
  address: '123 Main St, Anytown, USA',
  pictureUrl: 'https://example.com/photos/john-doe.jpg',
  createdAt: Date.now()
};

export const studentWithoutPicture: Student = {
  name: 'Jane Smith',
  dob: 694224000000,
  address: '456 Oak Ave, Somewhere, USA',
  pictureUrl: null,
  createdAt: Date.now()
};

export const invalidStudentMissingName = {
  dob: 631152000000,
  address: '789 Pine Rd, Nowhere, USA'
};

export const invalidStudentBadDate = {
  name: 'Bad Date Student',
  dob: 'invalid-date',
  address: '321 Elm St, Anywhere, USA'
};
```

## Best Practices

### 1. Test Organization

- **Group by functionality**: Organize tests by feature/module
- **Use descriptive names**: Test names should explain what they test
- **Follow AAA pattern**: Arrange, Act, Assert
- **One assertion per test**: Keep tests focused and simple

### 2. Mocking and Stubbing

- **Mock external dependencies**: Database, auth, network calls
- **Use sandbox for cleanup**: Ensure stubs are restored after tests
- **Create reusable mock factories**: Reduce duplication in test setup
- **Verify mock interactions**: Check that mocks were called correctly

### 3. Test Data Management

- **Use fixtures for common data**: Centralize test data
- **Generate random data when needed**: For uniqueness tests
- **Keep test data realistic**: Use valid formats and values
- **Clean up test data**: Ensure tests don't affect each other

### 4. Performance Considerations

- **Use offline mode for unit tests**: Faster and more reliable
- **Limit timeout values**: Fail fast for hanging tests
- **Run tests in parallel**: When tests are independent
- **Use test hooks efficiently**: Minimize setup/teardown overhead

### 5. Continuous Improvement

- **Add tests for bug fixes**: Prevent regression
- **Update tests with code changes**: Keep tests in sync
- **Review test coverage**: Identify untested code paths
- **Refactor tests**: Keep them maintainable

## CI/CD Integration

### GitHub Actions Configuration

Create `.github/workflows/test-functions.yml`:

```yaml
name: Test Firebase Functions

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'functions/**'
      - 'common/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'functions/**'
      - 'common/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [22.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'yarn'
    
    - name: Install dependencies
      run: |
        yarn install --frozen-lockfile
        cd functions && yarn install --frozen-lockfile
    
    - name: Build common types
      run: cd common && yarn build
    
    - name: Run linter
      run: cd functions && yarn lint
    
    - name: Run tests
      run: cd functions && yarn test
    
    - name: Generate coverage report
      run: cd functions && yarn test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        directory: ./functions/coverage
        flags: functions
        name: firebase-functions
```

### Pre-commit Hooks

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests for changed functions
if git diff --cached --name-only | grep -q "^functions/"; then
  cd functions && yarn test
fi
```

## Coverage Configuration

Create `functions/.nycrc.json`:

```json
{
  "extension": [".ts"],
  "include": ["src/**/*.ts"],
  "exclude": [
    "**/*.d.ts",
    "src/**/*.test.ts",
    "test/**"
  ],
  "reporter": ["text", "lcov", "html"],
  "all": true,
  "check-coverage": true,
  "branches": 80,
  "lines": 80,
  "functions": 80,
  "statements": 80
}
```

## Running Tests

### Basic Commands

```bash
# Run all tests
cd functions && yarn test

# Run tests in watch mode
cd functions && yarn test:watch

# Run tests with coverage
cd functions && yarn test:coverage

# Run specific test file
cd functions && yarn test test/unit/api/students/crudLogic.test.ts

# Run tests matching pattern
cd functions && yarn test --grep "should create student"
```

### Debugging Tests

For VS Code, add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Mocha Tests",
  "program": "${workspaceFolder}/functions/node_modules/.bin/mocha",
  "args": [
    "--recursive",
    "--require",
    "ts-node/register",
    "--timeout",
    "10000",
    "${workspaceFolder}/functions/test/**/*.test.ts"
  ],
  "cwd": "${workspaceFolder}/functions",
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Troubleshooting

### Common Issues and Solutions

1. **TypeScript compilation errors in tests**
   - Ensure `ts-node` is installed
   - Check `tsconfig.json` includes test files
   - Verify type definitions are installed

2. **Tests timing out**
   - Increase timeout in mocha configuration
   - Check for unresolved promises
   - Ensure async operations complete

3. **Mock not being called**
   - Verify mock is set up before importing functions
   - Check the correct method is being stubbed
   - Ensure mock matches actual implementation

4. **Firebase Admin initialization errors**
   - Mock admin.initializeApp in setup
   - Use offline mode for unit tests
   - Stub database references properly

## Conclusion

This comprehensive testing guide provides everything needed to implement robust unit testing for Firebase Functions in the Bus Transportation Tracking Application. By following these patterns and practices, you can ensure code quality, prevent regressions, and maintain confidence in your multi-tenant CRUD operations.

Key takeaways:
- Use `firebase-functions-test` for official Firebase testing support
- Implement both offline (unit) and online (integration) tests
- Follow consistent patterns for testing CRUD operations
- Ensure multi-tenant functionality is properly tested
- Integrate tests into CI/CD pipeline for continuous quality assurance

Remember to update tests whenever you modify the codebase, add new features, or fix bugs. Good test coverage is essential for maintaining a reliable and scalable Firebase Functions backend.