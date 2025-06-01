import { onRequest } from 'firebase-functions/v2/https';
import { getDatabaseWithUrl } from 'firebase-admin/database';
import * as admin from 'firebase-admin';
import { createDriver, updateDriver, deleteDriver } from './crudLogic';

export const driverIndex = onRequest(async (req: any, res: any) => {
  // Set CORS headers
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Tenant');

  console.log('Driver API endpoint called');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Body:', req.body);

  // Initialize Firebase Admin if not already initialized
  if (!admin.apps.length) {
    admin.initializeApp();
  }

  // Get tenant-specific database
  const tenant = req.headers.tenant as string;
  if (!tenant) {
    res.status(400).json({ message: 'Tenant header is required' });
    return;
  }

  // Get Firebase database references
  const db = getDatabaseWithUrl(`https://bus-app-2025-${tenant}.firebaseio.com`);
  const driverRef = db.ref('drivers');
  const routeRef = db.ref('routes');

  try {
    let result: {success: boolean, message: string};

    switch (req.method) {
      case 'OPTIONS':
        res.set('Access-Control-Allow-Methods', 'POST,PUT,DELETE');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'Content-Type,Tenant');
        res.status(204).send('');
        return;

      case 'POST':
        // Create driver
        result = await createDriver(req, driverRef);
        break;

      case 'PUT':
        // Update driver
        result = await updateDriver(req, driverRef);
        break;

      case 'DELETE':
        // Delete driver
        result = await deleteDriver(req, driverRef, routeRef);
        break;

      default:
        result = {success: false, message: `Method ${req.method} not allowed`};
        break;
    }

    // Send response
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.message
      });
    }

  } catch (error) {
    console.error('Error in driver API:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}); 