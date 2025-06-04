const admin = require('firebase-admin');
const axios = require('axios');

// Firebase configuration
let db = null;
let auth = null;
let isInitialized = false;

// Cloud Functions base URL - update this with your actual project
const CLOUD_FUNCTIONS_BASE_URL = process.env.FIREBASE_FUNCTIONS_URL || 
  'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api';

// Initialize Firebase Admin SDK
function initializeFirebase() {
  if (isInitialized) return;

  try {
    // For production, you'll need to provide service account credentials
    // Download from Firebase Console > Project Settings > Service Accounts
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    } else {
      // For development, you might use default credentials
      console.warn('No Firebase service account provided. Some features may not work.');
      // Uncomment below if you have default credentials set up
      // admin.initializeApp();
    }

    db = admin.database();
    auth = admin.auth();
    isInitialized = true;
    console.log('Firebase Admin SDK initialized');
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

module.exports = {
  initializeFirebase,
  callCloudFunction,
  getDb: () => db,
  getAuth: () => auth
};