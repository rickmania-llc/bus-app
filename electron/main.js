const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fileURLToPath } = require('url');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { initializeFirebase, callCloudFunction, getDb } = require('./firebase-config');

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, '../react-app/public/vite.svg')
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../react-app/dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

app.whenReady().then(() => {
  // Don't initialize Firebase yet - wait for tenant from React app
  mainWindow = createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ===== IPC Handlers for Students =====

// Setup student listeners (called when React app is ready)
ipcMain.handle('setup-students-listener', async (event, { tenant }) => {
  try {
    console.log(`Setting up student listeners for tenant: ${tenant}`);
    setupStudentsListeners(tenant);
    return { success: true };
  } catch (error) {
    console.error('Error setting up students listener:', error);
    throw error;
  }
});

// Add a new student (via Cloud Function)
ipcMain.handle('add-student', async (event, { studentData, tenant = 'dev', idToken }) => {
  try {
    const newStudent = await callCloudFunction('/studentCrud', 'POST', studentData, tenant, idToken);
    // The real-time listener will automatically pick up the change
    return newStudent;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
});

// Update a student (via Cloud Function)
ipcMain.handle('update-student', async (event, { studentId, studentData, tenant = 'dev', idToken }) => {
  try {
    const updatedStudent = await callCloudFunction(
      `/studentCrud/${studentId}`, 
      'PUT', 
      studentData, 
      tenant,
      idToken
    );
    // The real-time listener will automatically pick up the change
    return updatedStudent;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
});

// Delete a student (via Cloud Function)
ipcMain.handle('delete-student', async (event, { studentId, tenant = 'dev', idToken }) => {
  try {
    await callCloudFunction(`/studentCrud/${studentId}`, 'DELETE', null, tenant, idToken);
    // The real-time listener will automatically pick up the change
    return { success: true };
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
});

// Real-time listeners for students
let studentsValueListener = null;
let studentsChildListeners = {};

function setupStudentsListeners(tenant = 'dev') {
  // Store current tenant for cleanup
  currentTenant = tenant;
  
  // Initialize Firebase for this tenant if not already done
  initializeFirebase(tenant);
  
  const db = getDb(tenant);
  if (!db) {
    console.warn('Firebase DB not initialized, skipping real-time listeners');
    return;
  }

  const studentsRef = db.ref('students');

  // Clean up existing listeners
  if (studentsValueListener) {
    studentsRef.off('value', studentsValueListener);
  }
  Object.values(studentsChildListeners).forEach(listener => {
    studentsRef.off(listener.type, listener.callback);
  });

  // Initial data load
  studentsValueListener = studentsRef.on('value', (snapshot) => {
    const students = snapshot.val() || {};
    sendToAllWindows('students-updated', { 
      type: 'value', 
      data: students 
    });
  });

  // Child added
  studentsChildListeners.added = {
    type: 'child_added',
    callback: studentsRef.on('child_added', (snapshot) => {
      sendToAllWindows('students-updated', {
        type: 'child_added',
        key: snapshot.key,
        data: snapshot.val()
      });
    })
  };

  // Child changed
  studentsChildListeners.changed = {
    type: 'child_changed',
    callback: studentsRef.on('child_changed', (snapshot) => {
      sendToAllWindows('students-updated', {
        type: 'child_changed',
        key: snapshot.key,
        data: snapshot.val()
      });
    })
  };

  // Child removed
  studentsChildListeners.removed = {
    type: 'child_removed',
    callback: studentsRef.on('child_removed', (snapshot) => {
      sendToAllWindows('students-updated', {
        type: 'child_removed',
        key: snapshot.key,
        data: snapshot.val()
      });
    })
  };

  console.log('Students real-time listeners set up');
}

// Helper to send data to all windows
function sendToAllWindows(channel, data) {
  BrowserWindow.getAllWindows().forEach(window => {
    window.webContents.send(channel, data);
  });
}

// Store current tenant for cleanup
let currentTenant = null;

// Cleanup listeners on quit
app.on('before-quit', () => {
  if (currentTenant) {
    const db = getDb(currentTenant);
    if (db) {
      db.ref('students').off();
    }
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});