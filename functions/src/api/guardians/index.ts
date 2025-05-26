import { onRequest } from 'firebase-functions/v2/https';
import { database } from 'firebase-admin';
import * as admin from 'firebase-admin';
import { createGuardian, updateGuardian, deleteGuardian } from './crudLogic';

export const guardianIndex = onRequest(async (req: any, res: any) => {
  console.log('Guardian API endpoint called');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Body:', req.body);

  // Initialize Firebase Admin if not already initialized
  if (!admin.apps.length) {
    admin.initializeApp();
  }

  // Get Firebase database references
  const guardianRef = database().ref('guardians');
  const studentRef = database().ref('students');

  try {
    let result: {success: boolean, message: string};

    switch (req.method) {
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