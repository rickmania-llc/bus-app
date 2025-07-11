# Firebase Listener Architecture Fix

## Current Problems

### 1. React StrictMode Double Mounting
- In development, React StrictMode intentionally mounts components twice: mount → unmount → mount
- This causes `setupStudentListeners` to be called multiple times rapidly
- The cleanup function runs between mounts, but the timing creates race conditions

### 2. Multiple Listeners Being Created
- Each mount creates new Firebase listeners in Electron
- The cleanup happens asynchronously, so new listeners are created before old ones are removed
- Result: Multiple sets of listeners all firing events, causing duplicates

### 3. Initial Data Not Loading
- The current `once('value')` followed by child listeners has a timing issue
- Child listeners are being attached before the `once` completes
- The `isInitialLoad` flag with setTimeout is unreliable

### 4. Architecture Mismatch
- React component lifecycle doesn't align with Firebase listener lifecycle
- Multiple layers of state tracking (React ref, Redux state, Electron flag) create complexity
- No single source of truth for listener state

## Root Cause Analysis

The fundamental issue is trying to manage persistent Firebase listeners (which should be singleton) with React component lifecycle (which is designed to be disposable and re-mountable). The current approach fights against React's design principles.

## Proposed Solution

### 1. Move Listener Management to Electron Main Process Only

**Remove from React:**
- No listener setup in React components
- No cleanup management in React
- React only receives data, doesn't manage connections

**Electron becomes the single source of truth:**
- Listeners are set up once when Electron starts
- They persist for the entire application lifetime
- Never cleaned up until app quits

### 2. Implement Proper Singleton Pattern in Electron

```javascript
// In electron/main.js
let listenersInitialized = false;
let activeListeners = new Map(); // Track by tenant

function initializeAppListeners() {
  if (listenersInitialized) return;
  
  // Set up listeners for default tenant on app start
  setupTenantListeners('dev');
  listenersInitialized = true;
}

function setupTenantListeners(tenant) {
  if (activeListeners.has(tenant)) {
    console.log(`Listeners already active for tenant: ${tenant}`);
    return;
  }
  
  // Initialize Firebase for tenant
  initializeFirebase(tenant);
  
  // Set up all entity listeners
  setupStudentsListeners(tenant);
  // setupDriversListeners(tenant);
  // etc...
  
  activeListeners.set(tenant, true);
}
```

### 3. Fix the Firebase Listener Pattern

**Current Problem:** Using both `once` and child listeners causes timing issues and duplicate events.

**Solution:** Use only child listeners with proper initialization:

```javascript
function setupStudentsListeners(tenant) {
  const db = getDb(tenant);
  const studentsRef = db.ref('students');
  
  // Clear any existing listeners first
  studentsRef.off();
  
  // Track what data we've already sent to prevent duplicates
  const sentStudentIds = new Set();
  
  // Use a single query to get all data and listen for changes
  studentsRef.on('child_added', (snapshot) => {
    const studentId = snapshot.key;
    
    // For initial data, batch it
    if (!sentStudentIds.has(studentId)) {
      sentStudentIds.add(studentId);
      
      // Buffer initial data for 100ms to batch send
      bufferInitialData(studentId, snapshot.val());
    }
  });
  
  // Set up other listeners
  studentsRef.on('child_changed', ...);
  studentsRef.on('child_removed', ...);
}
```

### 4. Implement Smart Initial Data Loading

```javascript
let initialDataBuffer = new Map();
let initialDataTimer = null;

function bufferInitialData(key, data) {
  initialDataBuffer.set(key, data);
  
  // Clear existing timer
  if (initialDataTimer) clearTimeout(initialDataTimer);
  
  // Set new timer to send batched data
  initialDataTimer = setTimeout(() => {
    if (initialDataBuffer.size > 0) {
      const allData = Object.fromEntries(initialDataBuffer);
      sendToAllWindows('students-updated', {
        type: 'value',
        data: allData
      });
      initialDataBuffer.clear();
    }
  }, 100);
}
```

### 5. Simplify React Integration

**DashboardContainer:**
```javascript
useEffect(() => {
  // Don't set up listeners here
  // Just indicate that the UI is ready to receive data
  if (isElectron()) {
    window.electronAPI?.invoke('ui-ready', { component: 'dashboard' });
  }
}, []); // Empty deps - only run once
```

**Student Slice:**
- Remove `setupStudentListeners` thunk entirely
- Keep only the reducers for receiving data
- No IPC setup logic in Redux

### 6. Handle Tenant Switching

When tenant changes:
1. React dispatches a simple action with new tenant
2. Electron receives tenant change request
3. Electron sets up new tenant listeners (if needed)
4. Old tenant listeners can remain active (for quick switching)

## Implementation Steps

1. **Phase 1: Electron Singleton Setup**
   - Modify `app.whenReady()` to initialize listeners
   - Remove listener setup from IPC handlers
   - Implement activeListeners Map

2. **Phase 2: Fix Firebase Pattern**
   - Remove `once('value')` usage
   - Implement buffered initial data loading
   - Add duplicate prevention with Set

3. **Phase 3: Simplify React**
   - Remove setupStudentListeners thunk
   - Remove cleanup logic from components
   - Add simple "UI ready" notification

4. **Phase 4: Testing**
   - Verify single set of listeners
   - Confirm no duplicate events
   - Ensure initial data loads correctly
   - Test with StrictMode on and off

## Benefits

1. **Single Source of Truth**: Electron owns all listener state
2. **No Race Conditions**: Listeners exist before React even mounts
3. **Simpler React Code**: Components just receive data
4. **Better Performance**: No repeated setup/teardown
5. **Predictable Behavior**: Same in development and production

## Alternative Approach (If Singleton Not Desired)

If you must have component-controlled listeners, implement a **debounced setup** with **request IDs**:

1. Each setup request gets a unique ID
2. Electron debounces setup requests by 500ms
3. Only the latest request ID is honored
4. Previous request IDs are ignored
5. This prevents StrictMode double-mounting from creating duplicate listeners

However, the singleton approach is recommended as it's simpler and more aligned with how Firebase listeners are designed to work.

## Component-Initiated Flow Support

If you prefer the flow where Dashboard initiates the listener setup, here's a modified approach that supports this while preventing duplicates:

### Desired Flow
1. Dashboard opens and sends tenant to Electron to initiate Firebase listeners (sends "dev")
2. Electron fires initial listeners, does a `.once` to get all initial data, then sets all the added/removed listeners
3. Fires the initial data back to React
4. React gets the initial data, dispatches to Redux slice
5. Additional updates get fired to React which dispatches for adding/removing individual items

### Implementation for Component-Initiated Flow

```javascript
// In electron/main.js

// Track active listeners by tenant-entity combination
const activeListeners = new Map();

ipcMain.handle('setup-students-listener', async (event, { tenant }) => {
  const listenerKey = `students-${tenant}`;
  
  // Check if already setup for this tenant
  if (activeListeners.has(listenerKey)) {
    console.log(`Listeners already active for ${listenerKey}, re-sending current data`);
    
    // Just re-send the current data to this window
    const db = getDb(tenant);
    const snapshot = await db.ref('students').once('value');
    
    // Send to specific window that requested it
    event.sender.send('students-updated', {
      type: 'value',
      data: snapshot.val() || {}
    });
    
    return { success: true, message: 'Already setup - data resent' };
  }
  
  console.log(`Setting up new listeners for ${listenerKey}`);
  
  // Initialize Firebase for tenant if needed
  initializeFirebase(tenant);
  
  const db = getDb(tenant);
  const studentsRef = db.ref('students');
  
  // Step 1: Get initial snapshot using .once()
  const initialSnapshot = await studentsRef.once('value');
  const initialData = initialSnapshot.val() || {};
  
  // Step 2: Send initial data immediately
  sendToAllWindows('students-updated', {
    type: 'value',
    data: initialData
  });
  
  // Step 3: Track which IDs we've already sent to prevent duplicates
  const sentIds = new Set(Object.keys(initialData));
  
  // Step 4: Set up ongoing listeners with duplicate prevention
  const listeners = {
    childAdded: studentsRef.on('child_added', (snapshot) => {
      const id = snapshot.key;
      
      // Skip if we already sent this in initial data
      if (!sentIds.has(id)) {
        sentIds.add(id);
        sendToAllWindows('students-updated', {
          type: 'child_added',
          key: id,
          data: snapshot.val()
        });
      }
    }),
    
    childChanged: studentsRef.on('child_changed', (snapshot) => {
      sendToAllWindows('students-updated', {
        type: 'child_changed',
        key: snapshot.key,
        data: snapshot.val()
      });
    }),
    
    childRemoved: studentsRef.on('child_removed', (snapshot) => {
      const id = snapshot.key;
      sentIds.delete(id); // Remove from tracking
      
      sendToAllWindows('students-updated', {
        type: 'child_removed',
        key: id,
        data: snapshot.val()
      });
    })
  };
  
  // Store listener info for cleanup
  activeListeners.set(listenerKey, {
    ref: studentsRef,
    listeners: listeners,
    sentIds: sentIds
  });
  
  return { success: true };
});

// Add cleanup handler that properly removes listeners
ipcMain.handle('cleanup-students-listener', async (event, { tenant }) => {
  const listenerKey = `students-${tenant}`;
  
  if (activeListeners.has(listenerKey)) {
    const { ref } = activeListeners.get(listenerKey);
    
    // Remove all listeners
    ref.off();
    
    // Remove from tracking
    activeListeners.delete(listenerKey);
    
    console.log(`Cleaned up listeners for ${listenerKey}`);
  }
  
  return { success: true };
});
```

### React Component Setup

```javascript
// In DashboardContainer
useEffect(() => {
  let mounted = true;
  
  if (isElectron()) {
    // Setup listeners when component mounts
    dispatch(setupStudentListeners('dev'));
    
    // Cleanup when component unmounts
    return () => {
      mounted = false;
      // Optional: Could call cleanup-students-listener here
      // But with the activeListeners check, it's not necessary
    };
  }
}, []); // Empty deps array - only run once per mount
```

### Key Benefits of This Approach

1. **Supports your exact flow**: Dashboard initiates → `.once()` for initial → child listeners for updates
2. **Prevents duplicates**: The `sentIds` Set tracks what's already been sent
3. **Handles remounts**: The `activeListeners` Map ensures only one set of listeners per tenant
4. **Clean separation**: Each tenant gets its own isolated listeners
5. **Proper cleanup**: Can cleanly remove listeners when switching tenants

### Why This Works Better

- **Initial data arrives immediately** via `.once()` before child listeners are attached
- **No duplicate child_added events** because we track sent IDs
- **StrictMode safe** because second mount just gets data resent, doesn't create new listeners
- **Tenant switching ready** with proper cleanup handlers