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
- Simple reducer-only pattern - no async thunks or side effects
- Firebase updates dispatched from DatabaseHandler

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
**Purpose:** Student entity state management with simple CRUD operations
**State Shape:**
- `students: StudentWithId[]` - Array of student entities with ID field
- `loading: boolean` - Loading state for async operations
- `error: string | null` - Error message if operation failed

**Actions:**
- `setStudents(StudentWithId[])` - Replace entire students array
- `addStudent(StudentWithId)` - Add single student
- `updateStudent(StudentWithId)` - Update existing student by ID
- `deleteStudent(string)` - Remove student by ID
- `setLoading(boolean)` - Set loading state
- `setError(string | null)` - Set error message

**Key Features:**
- Simple reducer-only pattern, no async thunks
- All Firebase operations handled by DatabaseHandler
- Direct dispatching of actions from Firebase listeners
- Clean separation of concerns between state and data fetching

### `slices/driverSlice.ts`
**Purpose:** Driver entity state management
**State Shape:**
- `drivers: DriverWithId[]` - Array of drivers with IDs
- `loading: boolean` - Loading state
- `error: string | null` - Error message

**Actions:**
- `setDrivers(DriverWithId[])` - Replace entire drivers array
- `addDriver(DriverWithId)` - Add single driver
- `updateDriver(DriverWithId)` - Update existing driver by ID
- `deleteDriver(string)` - Remove driver by ID
- `setLoading(boolean)` - Set loading state
- `setError(string | null)` - Set error message

**Key Features:**
- Imports Driver type from common module
- Extends type with ID for Redux state
- Same CRUD pattern as other entity slices

### `slices/guardianSlice.ts`
**Purpose:** Guardian entity state management
**State Shape:**
- `guardians: GuardianWithId[]` - Array of guardians with IDs
- `loading: boolean` - Loading state
- `error: string | null` - Error message

**Actions:**
- `setGuardians(GuardianWithId[])` - Replace entire guardians array
- `addGuardian(GuardianWithId)` - Add single guardian
- `updateGuardian(GuardianWithId)` - Update existing guardian by ID
- `deleteGuardian(string)` - Remove guardian by ID
- `setLoading(boolean)` - Set loading state
- `setError(string | null)` - Set error message

### `slices/routeSlice.ts`
**Purpose:** Route entity state management
**State Shape:**
- `routes: RouteWithId[]` - Array of routes with IDs
- `loading: boolean` - Loading state
- `error: string | null` - Error message

**Actions:**
- `setRoutes(RouteWithId[])` - Replace entire routes array
- `addRoute(RouteWithId)` - Add single route
- `updateRoute(RouteWithId)` - Update existing route by ID
- `deleteRoute(string)` - Remove route by ID
- `setLoading(boolean)` - Set loading state
- `setError(string | null)` - Set error message

**Key Features:**
- Routes include templates and instances
- Complex state for embedded stops
- Support for route scheduling

## Key Dependencies
- `@reduxjs/toolkit` - Modern Redux patterns and utilities
- `react-redux` - React bindings (used in components)
- Common types from `../../../../common/types/`

## Common Workflows
1. **Entity Loading:** DatabaseHandler fetches data → Dispatch setStudents/setDrivers → Loading state auto-cleared
2. **Entity Creation:** Dispatch addStudent/addDriver → Update UI → DatabaseHandler syncs with Firebase
3. **Error Handling:** Catch error → Dispatch setError(message) → Display in UI → Clear with setError(null)
4. **View Navigation:** Dispatch setView → Reset selections → Update main panel
5. **Firebase Real-time Sync:** 
   - DashboardContainer mounts → DatabaseHandler.initDatabaseHandler → 
   - Firebase listeners set up for all entities → 
   - Firebase events trigger Redux dispatches → 
   - Redux state updates automatically → 
   - UI re-renders with new data

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
- Add batch operations for multiple entity updates