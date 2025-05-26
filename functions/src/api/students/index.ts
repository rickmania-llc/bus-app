import { Request } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { createStudent, updateStudent, deleteStudent } from './crudLogic';

/**
 * Main CRUD handler for students API
 * Handles POST (create), PUT (update), and DELETE operations
 */
export const crud = async (req: Request, res: any): Promise<void> => {
  // Set CORS headers
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // Initialize Firebase Admin if not already initialized
  if (!admin.apps.length) {
    admin.initializeApp();
  }

  const db = admin.database();
  const studentRef = db.ref('students');

  try {
    switch (req.method) {
      case 'OPTIONS':
        res.set('Access-Control-Allow-Methods', 'POST,PUT,DELETE');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;

      case 'POST':
        console.log('Creating student...');
        const createRes = await createStudent(req, studentRef);
        if (createRes.success) {
          res.status(201).json({ message: createRes.message });
        } else {
          res.status(400).json({ message: createRes.message });
        }
        return;

      case 'PUT':
        console.log('Updating student...');
        const putRes = await updateStudent(req, studentRef);
        if (putRes.success) {
          res.status(200).json({ message: putRes.message });
        } else {
          res.status(400).json({ message: putRes.message });
        }
        return;

      case 'DELETE':
        console.log('Deleting student...');
        const delRes = await deleteStudent(req, studentRef);
        if (delRes.success) {
          res.status(200).json({ message: delRes.message });
        } else {
          res.status(400).json({ message: delRes.message });
        }
        return;

      default:
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }
  } catch (error) {
    console.error('Student CRUD error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 