const admin = require('firebase-admin');
const axios = require('axios');

// Firebase configuration
let app = null;
let db = null;
let auth = null;
let currentTenant = null;
let isInitialized = false;

// Cloud Functions base URL - update this with your actual project
const CLOUD_FUNCTIONS_BASE_URL = process.env.FIREBASE_FUNCTIONS_URL || 
  'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api';

// Emulator configuration for development
const USE_EMULATORS = process.env.USE_FIREBASE_EMULATORS === 'true' || process.env.NODE_ENV === 'development';

// Initialize Firebase Admin SDK for a specific tenant
function initializeFirebase(tenant = 'dev') {
  if (isInitialized && currentTenant === tenant) return;

  try {
    let appConfig = {};
    
    // Set database URL for the tenant
    const databaseUrl = USE_EMULATORS 
      ? `http://localhost:9000/?ns=bus-app-2025-${tenant}` 
      : `https://bus-app-2025-${tenant}.firebaseio.com`;
    
    appConfig.databaseURL = databaseUrl;
    
    // For production, you'll need to provide service account credentials
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      appConfig.credential = admin.credential.cert(serviceAccount);
    } else if (USE_EMULATORS) {
      // For development with emulators
      console.log('Using Firebase emulators for development');
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
      process.env.FIREBASE_DATABASE_EMULATOR_HOST = 'localhost:9000';
      // Use default credentials for emulator
      appConfig.credential = admin.credential.applicationDefault();
    } else {
      console.warn('No Firebase service account provided. Some features may not work.');
    }

    // If already initialized with different tenant, delete the old app
    if (app) {
      admin.app().delete();
    }

    // Initialize app for this tenant
    app = admin.initializeApp(appConfig);
    db = app.database();
    auth = admin.auth();
    currentTenant = tenant;
    isInitialized = true;
    console.log(`Firebase Admin SDK initialized for tenant '${tenant}'` + (USE_EMULATORS ? ' with emulators' : ''));
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

// Helper to make authenticated requests to Cloud Functions
async function callCloudFunction(endpoint, method = 'GET', data = null, idToken = null) {
  const url = `${CLOUD_FUNCTIONS_BASE_URL}${endpoint}`;
  
  const config = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (idToken) {
    config.headers['Authorization'] = `Bearer ${idToken}`;
  }

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Cloud Function error for ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

// Get database reference
function getDb(tenant = 'dev') {
  // If we need a different tenant, reinitialize
  if (tenant !== currentTenant) {
    console.log(`Switching from tenant '${currentTenant}' to '${tenant}'`);
    initializeFirebase(tenant);
  }
  
  if (!isInitialized || !db) {
    console.error('Firebase not initialized. Call initializeFirebase() first.');
    return null;
  }

  return db;
}

// Helper to make authenticated requests to Cloud Functions with tenant
async function callCloudFunctionWithTenant(endpoint, method = 'GET', data = null, tenant = 'dev', idToken = null) {
  const baseUrl = USE_EMULATORS 
    ? 'http://localhost:5001/bus-app-2025/us-central1'
    : CLOUD_FUNCTIONS_BASE_URL;
    
  const url = `${baseUrl}${endpoint}`;
  
  const config = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      'Tenant': tenant
    }
  };

  if (idToken) {
    config.headers['Authorization'] = `Bearer ${idToken}`;
  }

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Cloud Function error for ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  initializeFirebase,
  callCloudFunction: callCloudFunctionWithTenant,
  getDb,
  getAuth: () => auth,
  USE_EMULATORS
};