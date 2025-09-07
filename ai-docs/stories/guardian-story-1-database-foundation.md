# User Story Development Specification

## Story Identifier
**Story ID:** GUI-001-01  
**Story Name:** Database and State Management Foundation  
**Epic:** Guardian Management UI Implementation  
**Priority:** P0 - Critical  
**Weight:** 8 Story Points

---

## Story Objective
**User Story:**  
As a developer  
I need to establish the database integration and state management foundation  
So that all UI components can properly interact with guardian data

**Technical Objective:**  
Implement the core database handler methods for Guardian CRUD operations and ensure proper Firebase listener setup with Redux state synchronization, following the existing Student management patterns to maintain consistency across the codebase.

---

## Prerequisites

### Dependencies Completed
- [ ] Firebase Cloud Functions `/guardianCrud` endpoint is deployed and functional
- [ ] Guardian Redux slice exists with basic actions (setGuardians, addGuardian, updateGuardian, deleteGuardian)
- [ ] Guardian TypeScript interface is defined in `types/models/Guardian.ts`
- [ ] Firebase Realtime Database is configured with multi-tenant support


# Services that must be running
- Firebase Emulators (for local development)
- React development server
```

### Required Access
- [ ] Write access to `react-app/src/utils/firebase/databaseHandler.ts`
- [ ] Read access to existing Student CRUD methods for pattern reference
- [ ] Access to Firebase Cloud Functions endpoint `/guardianCrud`

---

## Implementation Specifications

### Files to Modify

#### `react-app/src/utils/firebase/databaseHandler.ts`
**Current State:** Contains Student CRUD methods and listener initialization for all entities  
**Modifications Required:** Add Guardian CRUD methods following the Student pattern

**Add These Methods to the DatabaseHandler Class:**
```typescript
/**
 * Creates a new guardian via Firebase Cloud Functions
 * @param guardian - Guardian data without id and createdAt (handled by backend)
 * @returns Promise that resolves when the guardian is created
 */
static async createGuardian(guardian: Omit<Guardian, 'id' | 'createdAt'>): Promise<void> {
  if (!this.tenant) {
    throw new Error('DatabaseHandler not initialized');
  }

  try {
    const response = await axios.post(`${funcURL}guardianCrud`, guardian, {
      headers: {
        'Tenant': this.tenant
      }
    });

    // Backend returns 201 status for successful creation
    // The response only contains { message: "..." } without success field
    if (response.status !== 201) {
      throw new Error(response.data.message || 'Failed to create guardian');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
}

/**
 * Updates an existing guardian via Firebase Cloud Functions
 * @param id - The guardian ID to update
 * @param updates - Partial guardian data to update (excluding id and createdAt)
 * @returns Promise that resolves when the guardian is updated
 */
static async updateGuardian(
  id: string, 
  updates: Partial<Omit<Guardian, 'id' | 'createdAt'>>
): Promise<void> {
  if (!this.tenant) {
    throw new Error('DatabaseHandler not initialized');
  }

  try {
    const response = await axios.put(`${funcURL}guardianCrud/${id}`, updates, {
      headers: {
        'Tenant': this.tenant
      }
    });

    // Backend returns 200 status for successful update
    // The response only contains { message: "..." } without success field
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to update guardian');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
}

/**
 * Deletes a guardian via Firebase Cloud Functions
 * @param id - The guardian ID to delete
 * @returns Promise that resolves when the guardian is deleted
 */
static async deleteGuardian(id: string): Promise<void> {
  if (!this.tenant) {
    throw new Error('DatabaseHandler not initialized');
  }

  try {
    const response = await axios.delete(`${funcURL}guardianCrud/${id}`, {
      headers: {
        'Tenant': this.tenant
      }
    });

    // Backend returns 200 status for successful deletion
    // The response only contains { message: "..." } without success field
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to delete guardian');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
}
```

### Verify Existing Guardian Listener Implementation
The `initGuardianListeners()` method already exists and follows the correct pattern. Verify it includes:

1. **Initial data load with `onValue`**
2. **Proper listener cleanup after initial load**
3. **Child event listeners with timestamp filtering**
4. **Correct Redux action dispatching**
5. **Listener storage in activeListeners Map**

**Expected Guardian Listener Pattern (Already Implemented):**
```typescript
private static initGuardianListeners() {
  // 1. Check if listeners already exist
  // 2. Get initial snapshot with onValue
  // 3. Transform data and dispatch setGuardians
  // 4. Clean up value listener
  // 5. Set up child listeners with timestamp filtering
  // 6. Store listener references for cleanup
}
```

---

## API Contracts

### Endpoint: `POST /guardianCrud`

**Request:**
```http
POST https://us-central1-bus-app-2025.cloudfunctions.net/guardianCrud HTTP/1.1
Content-Type: application/json
Tenant: dev

{
  "name": "John Doe",
  "govId": "123456789",
  "pictureUrl": "https://example.com/photo.jpg",
  "students": {
    "student-id-1": {
      "reference": true,
      "isPrimaryGuardian": true
    },
    "student-id-2": {
      "reference": true,
      "isPrimaryGuardian": false
    }
  }
}
```

**Success Response (201):**
```json
{
  "message": "Guardian created successfully"
}
```

**Error Responses:**
```javascript
// 400 - Validation Error
{
  "message": "Name is required"
}

// 401 - Missing Tenant Header
{
  "message": "Tenant header is required"
}

// 500 - Server Error
{
  "message": "Failed to create guardian: [error details]"
}
```

### Endpoint: `PUT /guardianCrud/{id}`

**Request:**
```http
PUT https://us-central1-bus-app-2025.cloudfunctions.net/guardianCrud/guardian-123 HTTP/1.1
Content-Type: application/json
Tenant: dev

{
  "name": "John Smith",
  "students": {
    "student-id-3": {
      "reference": true,
      "isPrimaryGuardian": true
    }
  }
}
```

**Success Response (200):**
```json
{
  "message": "Guardian updated successfully"
}
```

### Endpoint: `DELETE /guardianCrud/{id}`

**Request:**
```http
DELETE https://us-central1-bus-app-2025.cloudfunctions.net/guardianCrud/guardian-123 HTTP/1.1
Tenant: dev
```

**Success Response (200):**
```json
{
  "message": "Guardian deleted successfully"
}
```

---

## Business Logic Requirements

### Data Validation
- Guardian name must not be empty
- Government ID must not be empty
- Picture URL can be null or a valid URL string
- Students object can be empty for new guardians
- Each student reference must include `reference: true` and `isPrimaryGuardian` boolean

### Tenant Isolation
- All requests must include tenant header
- Database operations scoped to tenant-specific database
- No cross-tenant data access

### Error Handling
- Provide meaningful error messages for user feedback
- Log errors for debugging but don't expose internal details
- Handle network failures gracefully with retry logic in UI layer

### State Synchronization
- Firebase listeners update Redux state in real-time
- No duplicate events during initial load
- Proper cleanup of listeners on component unmount
- Maintain consistency between local state and Firebase

---

## Error Handling

### Expected Errors to Handle
| Scenario | Error Type | User Message | Log Level |
|----------|------------|--------------|-----------|
| Missing tenant | Configuration Error | "System configuration error" | ERROR |
| Network timeout | Network Error | "Connection failed. Please try again" | WARN |
| Invalid guardian data | Validation Error | Specific field error message | INFO |
| Guardian not found | Not Found Error | "Guardian not found" | WARN |
| Duplicate guardian | Conflict Error | "Guardian already exists" | INFO |
| Firebase down | Service Error | "Service temporarily unavailable" | ERROR |

### Error Response Pattern
```typescript
try {
  // API call
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Extract message from backend response
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
  // Re-throw non-Axios errors
  throw error;
}
```

---

## Test Implementation

### Unit Tests Required

#### `test/utils/firebase/databaseHandler.test.ts`
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import DatabaseHandler from '../../../src/utils/firebase/databaseHandler';
import type { Guardian } from '../../../src/types/models/Guardian';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DatabaseHandler - Guardian Methods', () => {
  beforeEach(() => {
    // Initialize DatabaseHandler with mock dispatch and tenant
    const mockDispatch = vi.fn();
    DatabaseHandler.initDatabaseHandler(mockDispatch, 'test-tenant');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createGuardian', () => {
    it('should create guardian with valid data', async () => {
      const guardianData: Omit<Guardian, 'id' | 'createdAt'> = {
        name: 'John Doe',
        govId: '123456789',
        pictureUrl: null,
        students: {}
      };

      mockedAxios.post.mockResolvedValueOnce({
        status: 201,
        data: { message: 'Guardian created successfully' }
      });

      await expect(DatabaseHandler.createGuardian(guardianData))
        .resolves.not.toThrow();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('guardianCrud'),
        guardianData,
        expect.objectContaining({
          headers: { 'Tenant': 'test-tenant' }
        })
      );
    });

    it('should throw error when backend returns non-201 status', async () => {
      const guardianData: Omit<Guardian, 'id' | 'createdAt'> = {
        name: 'John Doe',
        govId: '123456789',
        pictureUrl: null,
        students: {}
      };

      mockedAxios.post.mockResolvedValueOnce({
        status: 400,
        data: { message: 'Invalid guardian data' }
      });

      await expect(DatabaseHandler.createGuardian(guardianData))
        .rejects.toThrow('Invalid guardian data');
    });

    it('should handle network errors', async () => {
      const guardianData: Omit<Guardian, 'id' | 'createdAt'> = {
        name: 'John Doe',
        govId: '123456789',
        pictureUrl: null,
        students: {}
      };

      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

      await expect(DatabaseHandler.createGuardian(guardianData))
        .rejects.toThrow('Network error');
    });
  });

  describe('updateGuardian', () => {
    it('should update guardian with partial data', async () => {
      const updates: Partial<Omit<Guardian, 'id' | 'createdAt'>> = {
        name: 'Jane Doe'
      };

      mockedAxios.put.mockResolvedValueOnce({
        status: 200,
        data: { message: 'Guardian updated successfully' }
      });

      await expect(DatabaseHandler.updateGuardian('guardian-123', updates))
        .resolves.not.toThrow();

      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('guardianCrud/guardian-123'),
        updates,
        expect.objectContaining({
          headers: { 'Tenant': 'test-tenant' }
        })
      );
    });
  });

  describe('deleteGuardian', () => {
    it('should delete guardian by id', async () => {
      mockedAxios.delete.mockResolvedValueOnce({
        status: 200,
        data: { message: 'Guardian deleted successfully' }
      });

      await expect(DatabaseHandler.deleteGuardian('guardian-123'))
        .resolves.not.toThrow();

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining('guardianCrud/guardian-123'),
        expect.objectContaining({
          headers: { 'Tenant': 'test-tenant' }
        })
      );
    });
  });
});
```

### Integration Tests Required

#### `test/integration/guardian-state-sync.test.ts`
```typescript
describe('Guardian State Synchronization', () => {
  it('should sync guardian creation with Redux state', async () => {
    // Create guardian via DatabaseHandler
    // Verify guardian appears in Redux state via listener
    // Verify no duplicate events
  });

  it('should sync guardian updates with Redux state', async () => {
    // Update guardian via DatabaseHandler
    // Verify changes reflected in Redux state
    // Verify only one update event dispatched
  });

  it('should sync guardian deletion with Redux state', async () => {
    // Delete guardian via DatabaseHandler
    // Verify guardian removed from Redux state
    // Verify proper cleanup
  });

  it('should handle listener cleanup on unmount', async () => {
    // Initialize listeners
    // Call cleanup method
    // Verify all listeners removed
    // Verify no memory leaks
  });
});
```

### Test Data Required
```typescript
// Test fixtures
export const mockGuardians: Guardian[] = [
  {
    id: 'guardian-1',
    name: 'John Doe',
    govId: '123456789',
    pictureUrl: 'https://example.com/john.jpg',
    students: {
      'student-1': {
        reference: true,
        isPrimaryGuardian: true
      }
    },
    createdAt: 1704067200000
  },
  {
    id: 'guardian-2',
    name: 'Jane Smith',
    govId: '987654321',
    pictureUrl: null,
    students: {},
    createdAt: 1704153600000
  }
];

// Mock Firebase snapshot
export const mockFirebaseSnapshot = {
  val: () => ({
    'guardian-1': {
      name: 'John Doe',
      govId: '123456789',
      pictureUrl: 'https://example.com/john.jpg',
      students: {
        'student-1': {
          reference: true,
          isPrimaryGuardian: true
        }
      },
      createdAt: 1704067200000
    }
  }),
  key: 'guardian-1'
};
```

---

## Acceptance Criteria Checklist

### Functional Requirements
- [ ] `createGuardian` method successfully creates new guardians in Firebase
- [ ] `updateGuardian` method successfully updates existing guardians
- [ ] `deleteGuardian` method successfully removes guardians from Firebase
- [ ] All methods include tenant header in requests
- [ ] All methods handle errors appropriately with meaningful messages
- [ ] Guardian slice actions (setGuardians, addGuardian, updateGuardian, deleteGuardian) work correctly
- [ ] Firebase listeners properly initialized on DatabaseHandler init
- [ ] Real-time updates reflected in Redux state without duplicates
- [ ] Listener cleanup prevents memory leaks

### Technical Requirements
- [ ] TypeScript types properly defined for all guardian operations
- [ ] Methods follow exact same pattern as Student CRUD methods
- [ ] Error handling matches existing patterns
- [ ] Console logging follows existing patterns for debugging
- [ ] No breaking changes to existing functionality
- [ ] Code passes TypeScript compilation with strict mode
- [ ] No ESLint errors or warnings

### Performance Requirements
- [ ] CRUD operations complete within 2 seconds
- [ ] No duplicate Firebase events during initial load
- [ ] Listener setup completes within 1 second
- [ ] No memory leaks from active listeners
- [ ] Efficient state updates without unnecessary re-renders

---

## Development Checklist

### Before Starting
- [ ] Pull latest code from `cmad-new` branch
- [ ] Run `yarn install` to ensure dependencies are up to date
- [ ] Start Firebase emulators: `yarn emulators`
- [ ] Start React dev server: `yarn dev`
- [ ] Review existing Student CRUD implementation for patterns

### During Development
- [ ] Create feature branch: `feature/GUI-001-01-database-foundation`
- [ ] Implement Guardian CRUD methods in DatabaseHandler
- [ ] Test each method with Firebase emulator
- [ ] Verify Redux state updates via React DevTools
- [ ] Write unit tests for new methods
- [ ] Run `yarn lint` to check for issues
- [ ] Commit with meaningful messages following convention

### Before Completion
- [ ] All acceptance criteria met
- [ ] All tests passing: `yarn test`
- [ ] Build succeeds: `yarn build`
- [ ] No console errors in browser
- [ ] Firebase emulator tests successful
- [ ] Code reviewed (self-review first)
- [ ] Documentation comments added

### Definition of Done
- [ ] Code merged to `cmad-new` branch
- [ ] Tests passing in CI/CD pipeline
- [ ] No regression in existing functionality
- [ ] Firebase listeners working correctly
- [ ] Redux state management verified
- [ ] Ready for UI components to consume

---

## Notes & Clarifications

### Implementation Patterns to Follow
- Use exact same error handling pattern as Student CRUD
- Maintain consistent console logging for debugging
- Follow existing axios configuration and header patterns
- Ensure TypeScript strict mode compliance

### Security Considerations
- Never log sensitive guardian information (govId)
- Validate tenant header on all requests
- Sanitize error messages before displaying to users
- Ensure proper Firebase security rules are in place

### Known Considerations
- Firebase security rules currently restrictive (may need adjustment)
- Guardian-Student relationship complexity requires careful state management
- Primary guardian designation validation happens at UI level
- Tenant isolation critical for multi-tenant architecture

### Dependencies on Other Stories
- Story 2 (Guardian List View) depends on this foundation
- Story 3 (Guardian Card and Side Panel) requires these CRUD methods
- Story 4 (Student Assignment) needs guardian update functionality

### Future Enhancements (Not in This Story)
- Bulk guardian operations
- Guardian data import/export
- Audit logging for guardian changes
- Advanced error recovery mechanisms

---

**Story Generated:** 2025-09-07  
**Scrum Master:** Claude Code  
**Source:** Guardian UI Implementation Epic v1.0  
**Sprint:** Sprint 1 - Foundation