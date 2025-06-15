import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth } from 'firebase/auth';

let firebaseApp: FirebaseApp;
let database: Database;
let dbURL: string;
let funcURL: string;

const initFirebase = (tenant: string) => {
  console.log('initFirebase with tenant:', tenant);
  
  const project = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  
  if (import.meta.env.VITE_FIREBASE_ENV === 'production') {
    dbURL = `https://bus-app-2025-${tenant}.firebaseio.com`;
    funcURL = `https://us-central1-bus-app-2025.cloudfunctions.net/`;
  } else {
    // Development/Emulator mode
    dbURL = `http://127.0.0.1:9000/?ns=bus-app-2025-${tenant}`;
    funcURL = `http://localhost:5001/bus-app-2025/us-central1/`;
  }
  
  const firebaseConfig = {
    apiKey,
    databaseURL: dbURL,
    projectId: project,
  };
  
  firebaseApp = initializeApp(firebaseConfig);
  database = getDatabase(firebaseApp);
  
  return { firebaseApp, database, funcURL };
};

// Future: Add user authentication and permissions
const setUserPermissions = (userRole: string) => {
  // TODO: Implement permissions based on role
  // For now, this is a placeholder for future auth implementation
  console.log('Setting permissions for role:', userRole);
};

export { initFirebase, firebaseApp, database, funcURL };