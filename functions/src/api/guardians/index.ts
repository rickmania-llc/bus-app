import { onRequest } from 'firebase-functions/v2/https';
import { getDatabaseWithUrl } from 'firebase-admin/database';
import * as admin from 'firebase-admin';
import { createGuardian, updateGuardian, deleteGuardian } from './crudLogic';

export const guardianIndex = onRequest(async (req: any, res: any) => {
  // Set CORS headers
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Tenant');

  console.log('Guardian API endpoint called');
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
  const guardianRef = db.ref('guardians');
  const studentRef = db.ref('students');

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
        // Create guardian
        result = await createGuardian(req, guardianRef, studentRef);
        break;

      case 'PUT':
        // Update guardian
        result = await updateGuardian(req, guardianRef, studentRef);
        break;

      case 'DELETE':
        // Delete guardian
        result = await deleteGuardian(req, guardianRef);
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
    console.error('Error in guardian API:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}); 