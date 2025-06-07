# Redux State Management Module

## Directory Purpose
Centralized state management using Redux Toolkit for the bus tracking admin dashboard. Manages application state including UI state, entity data (students, drivers, routes, guardians), loading states, and error handling across the React application.

## Architecture Notes
- Redux Toolkit for modern Redux patterns with less boilerplate
- Feature-based slice organization
- TypeScript for type-safe actions and state
- Separate slices for each entity type and app-level concerns
- Consistent patterns for CRUD operations across entity slices
- Loading and error states managed per entity

## Files Overview

### `store.ts`
**Purpose:** Redux store configuration and type exports
**Key Exports:**
- `store` - Configured Redux store with all reducers
- `RootState` - Type definition for entire state tree
- `AppDispatch` - Type definition for dispatch function

**Configured Reducers:**
- `app` - Application UI state
- `students` - Student entity state
- `guardians` - Guardian entity state
- `drivers` - Driver entity state
- `routes` - Route entity state

### `slices/appSlice.ts`
**Purpose:** Application-level UI state management
**State Shape:**
- `currentView: ViewType` - Active navigation view
- `selectedItemId: string | null` - Currently selected entity ID
- `isRightPanelVisible: boolean` - Right panel visibility
- `isInfoPanelVisible: boolean` - Info panel visibility

**Actions:**
- `setView(ViewType)` - Changes current view and resets selections
- `setSelectedItemId(string | null)` - Sets selected entity
- `toggleRightPanel(boolean | undefined)` - Controls right panel
- `toggleInfoPanel(boolean | undefined)` - Controls info panel

### `slices/studentSlice.ts`
**Purpose:** Student entity state management
**State Shape:**
- `students: Student[]` - Array of student entities
- `loading: boolean` - Loading state for async operations
- `error: string | null` - Error message if operation failed

**Actions:**
- `setStudents(Student[])` - Replace entire students array
- `addStudent(Student)` - Add single student
- `updateStudent(Student)` - Update existing student by ID
- `deleteStudent(string)` - Remove student by ID
- `setLoading(boolean)` - Set loading state
- `setError(string | null)` - Set error message

### `slices/driverSlice.ts`
**Purpose:** Driver entity state management with common types
**State Shape:**
- `drivers: DriverWithId[]` - Array of drivers with IDs
- `loading: boolean` - Loading state
- `error: string | null` - Error message

**Key Features:**
- Imports Driver type from common module
- Extends type with ID for Redux state
- Same CRUD pattern as other entity slices

### `slices/guardianSlice.ts`
**Purpose:** Guardian entity state management
**Expected Structure:**
- Similar pattern to student and driver slices
- Guardian array with loading/error states
- CRUD actions for guardian management

### `slices/routeSlice.ts`
**Purpose:** Route entity state management
**Expected Structure:**
- Routes array including templates and instances
- Complex state for embedded stops
- Actions for route scheduling and management

## Key Dependencies
- `@reduxjs/toolkit` - Modern Redux patterns and utilities
- `react-redux` - React bindings (used in components)
- Common types from `../../../../common/types/`

## Common Workflows
1. **Entity Loading:** Component dispatches setLoading(true) → Fetch data → Dispatch setStudents/setDrivers → Dispatch setLoading(false)
2. **Entity Creation:** Dispatch addStudent/addDriver → Update UI → Sync with backend
3. **Error Handling:** Catch error → Dispatch setError(message) → Display in UI → Clear with setError(null)
4. **View Navigation:** Dispatch setView → Reset selections → Update main panel

## Performance Considerations
- Redux Toolkit uses Immer for immutable updates (performance optimized)
- Normalized state structure prevents deep nesting
- Selective subscriptions in components to minimize re-renders
- Entity arrays could be normalized to objects for O(1) lookups

## Security Notes
- No sensitive data (passwords, tokens) stored in Redux
- State persisted only in memory (no localStorage)
- API tokens should be managed separately (context or secure storage)

## Testing Approach
- Test reducers in isolation with action creators
- Mock store for component integration tests
- Test selectors for derived state
- Verify immutability of state updates

## State Patterns
- **Loading States:** Each entity slice has independent loading state
- **Error Handling:** Errors stored as strings, cleared on successful operations
- **ID Management:** Entities include ID field for Redux operations
- **View State:** UI state separate from data state
- **Selection Pattern:** Single selected item ID, cleared on view change

## Future Enhancements
- Add Redux Toolkit Query for API integration
- Implement optimistic updates for better UX
- Add state persistence for offline support
- Create reusable entity slice factory
- Add undo/redo functionality
- Implement real-time sync with Firebase