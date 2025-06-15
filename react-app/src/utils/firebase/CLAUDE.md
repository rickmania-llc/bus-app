# Firebase Integration Module

## Directory Purpose
Direct Firebase integration for the React admin dashboard, providing real-time database synchronization, authentication management, and cloud function access. Replaces the previous Electron IPC architecture with direct Firebase Web SDK integration.

## Architecture Notes
- Direct connection to Firebase Realtime Database using Web SDK
- Multi-tenant support through dynamic database URL configuration
- Real-time listeners with duplicate prevention
- Redux integration for state management
- Environment-based configuration (production vs development/emulators)
- Prepared for future authentication implementation

## Files Overview

### `authHandler.ts`
**Purpose:** Firebase initialization and configuration management
**Key Functions:**
- `initFirebase(tenant: string)` - Initializes Firebase with tenant-specific configuration
  - Parameters: tenant identifier (e.g., 'dev', 'prod')
  - Returns: { firebaseApp, database, funcURL }
  - Configures database URL based on environment
  - Sets up API key authentication
- `setUserPermissions(userRole: string)` - Placeholder for future role-based permissions

**Key Variables:**
- `firebaseApp` - Initialized Firebase application instance
- `database` - Firebase Realtime Database instance
- `dbURL` - Tenant-specific database URL
- `funcURL` - Cloud Functions endpoint URL

### `databaseHandler.ts`
**Purpose:** Manages all real-time database listeners and Redux dispatching
**Key Functions:**
- `initDatabaseHandler(dispatch: AppDispatch, tenant: string)` - Main initialization
  - Calls initFirebase from authHandler
  - Sets up listeners for all entities
  - Stores dispatch function for Redux updates
- `initStudentListeners()` - Sets up student entity listeners
  - Uses once() for initial data load
  - Queries by createdAt timestamp for chronological ordering
  - Prevents duplicate events with timestamp-based filtering
- `initGuardianListeners()` - Sets up guardian entity listeners
- `initDriverListeners()` - Sets up driver entity listeners
- `initRouteListeners()` - Sets up route entity listeners
- `cleanup()` - Removes all active listeners

**Pattern for Each Entity:**
1. Check if listeners already exist for tenant
2. Get initial data with onValue (once)
3. Dispatch setEntity action with full data
4. Extract highest createdAt timestamp from initial data
5. Set up child listeners with orderByChild('createdAt')
6. Use startAfter(lastTimestamp) to get only new items
7. Store listener info in activeListeners Map

### `types.ts`
**Purpose:** TypeScript type definitions for Firebase integration
**Key Types:**
- `FirebaseUpdate<T>` - Generic type for Firebase update events
  - type: 'value' | 'child_added' | 'child_changed' | 'child_removed'
  - data: The entity data
  - key: Optional entity ID
- `ListenerInfo` - Tracks active listener information
  - ref: Firebase database reference
  - listeners: Object of listener functions
  - sentIds: Set of already-processed IDs

## Key Dependencies
- `firebase/app` - Firebase core functionality
- `firebase/database` - Realtime Database SDK
- `firebase/auth` - Authentication (future use)
- Redux store and entity types from the app

## Common Workflows
1. **Initialization:** DashboardContainer mounts → Calls DatabaseHandler.initDatabaseHandler → initFirebase → Set up all listeners
2. **Data Flow:** Firebase event → DatabaseHandler listener → Dispatch Redux action → Update UI
3. **Cleanup:** Component unmounts → DatabaseHandler.cleanup → Remove all listeners

## Performance Considerations
- Uses Map to track active listeners and prevent duplicates
- Initial data loaded once, then only incremental updates
- Timestamp-based ordering ensures chronological data flow
- Efficient listener cleanup on unmount
- OrderByChild('createdAt') query optimization

## Security Notes
- API key authentication required
- Database URL includes tenant for data isolation
- Future: Add Firebase Auth for user authentication
- Environment variables for sensitive configuration

## Testing Approach
- Use Firebase emulators for local development
- Set VITE_FIREBASE_ENV=development for emulator URLs
- Monitor console for listener setup/cleanup logs
- Verify no duplicate events in Redux DevTools

## Future Enhancements
- Add Firebase Authentication integration
- Implement role-based access control
- Add offline persistence support
- Implement retry logic for connection failures