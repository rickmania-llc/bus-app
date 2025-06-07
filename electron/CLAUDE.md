# Electron Module

## Directory Purpose
Desktop application wrapper for the React admin dashboard using Electron. Provides native desktop experience with secure IPC (Inter-Process Communication) between the main process and React renderer, Firebase integration for real-time data synchronization, and cloud function access.

## Architecture Notes
- Electron main process manages window lifecycle and Firebase connections
- Preload script provides secure bridge between main and renderer processes
- Context isolation and sandboxing for security
- Real-time Firebase listeners with automatic UI updates
- Cloud function integration for API calls
- Development mode with hot reload support

## Files Overview

### `main.js`
**Purpose:** Main process entry point managing application lifecycle and IPC handlers
**Key Functions:**
- `createWindow()` - Creates main application window with security settings
- `initializeFirebase()` - Initializes Firebase Admin SDK on app ready
- `setupStudentsListeners()` - Sets up real-time Firebase listeners for student data
- `sendToAllWindows(channel, data)` - Broadcasts data updates to all open windows

**IPC Handlers:**
- `setup-students-listener` - Initializes real-time student data synchronization
- `add-student` - Creates new student via cloud function
- `update-student` - Updates existing student via cloud function
- `delete-student` - Removes student via cloud function

**Real-time Listeners:**
- Value listener for initial data load
- Child added/changed/removed listeners for incremental updates

### `preload.js`
**Purpose:** Secure bridge exposing limited IPC functionality to renderer process
**Key APIs:**
- `electronAPI.invoke(channel, ...args)` - Invoke main process handlers with whitelisted channels
- `electronAPI.send(channel, ...args)` - Send one-way messages to main process
- `electronAPI.on(channel, callback)` - Listen for events from main process with cleanup

**Whitelisted Channels:**
- Student operations: setup, add, update, delete
- Route operations: get, add, update, delete
- Driver operations: get, add, update, delete
- Guardian operations: get, add, update, delete
- Real-time updates: students-updated, routes-updated, etc.

### `firebase-config.js`
**Purpose:** Firebase Admin SDK configuration and cloud function utilities
**Key Functions:**
- `initializeFirebase()` - Initializes Firebase Admin SDK with service account
- `callCloudFunction(endpoint, method, data, idToken)` - Makes authenticated API calls
- `getDb()` - Returns Firebase Realtime Database reference
- `getAuth()` - Returns Firebase Auth reference

**Configuration:**
- Service account path from environment variable
- Database URL configuration
- Cloud Functions base URL with fallback

### `README.md`
**Purpose:** Setup and usage documentation for Electron module
**Key Sections:**
- Development workflow instructions
- Production build process
- Architecture overview
- Security considerations

## Key Dependencies
- `electron` - Desktop application framework
- `firebase-admin` - Firebase Admin SDK for backend operations
- `axios` - HTTP client for cloud function calls
- React app at `../react-app/` for UI

## Common Workflows
1. **Development:** Start React dev server → Launch Electron with NODE_ENV=development → Auto-connects to localhost:5173
2. **Production:** Build React app → Package with Electron → Loads from dist folder
3. **Data Flow:** User action → IPC call → Main process → Firebase/Cloud Function → Real-time update → All windows
4. **Authentication:** Get ID token from renderer → Pass to main process → Include in cloud function calls

## Performance Considerations
- Real-time listeners minimize API calls through incremental updates
- Window state management prevents memory leaks
- Proper cleanup of Firebase listeners on app quit
- Development mode includes DevTools for debugging

## Security Notes
- Context isolation enabled to prevent renderer access to Node.js
- No direct Node integration in renderer process
- All IPC channels explicitly whitelisted
- Firebase credentials kept in main process only
- Service account credentials required for production
- ID tokens validated for authenticated operations

## Environment Variables
- `NODE_ENV` - Development/production mode detection
- `FIREBASE_SERVICE_ACCOUNT_PATH` - Path to service account JSON
- `FIREBASE_DATABASE_URL` - Firebase Realtime Database URL
- `FIREBASE_FUNCTIONS_URL` - Cloud Functions base URL

## Error Handling
- Uncaught exception handlers for crash prevention
- Unhandled rejection logging for debugging
- Try-catch blocks around all Firebase operations
- Error propagation through IPC for user feedback