import { Request } from 'firebase-functions/v2/https';
import { database } from 'firebase-admin';
import { Guardian } from '../../../../common/types';

/**
 * Validates and processes the students array for guardian operations
 */
const processStudentsArray = async (
  students: any,
  studentRef: database.Reference
): Promise<{ isValid: boolean, studentsObject?: any, error?: string }> => {
  if (students === null || students === undefined) {
    return { isValid: true, studentsObject: null };
  }

  if (!Array.isArray(students)) {
    return { isValid: false, error: 'Students must be an array or null' };
  }

  if (students.length === 0) {
    return { isValid: true, studentsObject: {} };
  }

  const studentsObject: any = {};
  
  for (const student of students) {
    if (!student.id || typeof student.id !== 'string') {
      return { isValid: false, error: 'Each student must have a valid id (string)' };
    }
    
    if (typeof student.isPrimaryGuardian !== 'boolean') {
      return { isValid: false, error: 'Each student must have isPrimaryGuardian (boolean)' };
    }

    // Validate that the student exists
    const snapshot = await studentRef.orderByKey().equalTo(student.id).once('value');
    if (snapshot.val() === null) {
      return { isValid: false, error: `Student ${student.id} not found` };
    }

    studentsObject[student.id] = {
      reference: true,
      isPrimaryGuardian: student.isPrimaryGuardian
    };
  }

  return { isValid: true, studentsObject };
};

/**
 * Creates a new guardian in the Firebase Realtime Database
 */
export const createGuardian = async (
  req: Request, 
  guardianRef: database.Reference,
  studentRef: database.Reference
): Promise<{success: boolean, message: string}> => {
  console.log('In guardian create function');
  console.log(req.body);
  
  const body = req.body;
  // pictureUrl is now optional
  const requiredFields = ['name', 'govId'];
  
  // Basic validation for required fields
  for (const field of requiredFields) {
    console.log(`testing ${field}`);
    console.log(body[field]);
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return {success: false, message: `Missing required field: ${field}`};
    }
  }

  // Additional validation for pictureUrl if provided (basic URL format check)
  if (body.pictureUrl !== undefined && body.pictureUrl !== null && body.pictureUrl !== '') {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(body.pictureUrl)) {
      return {success: false, message: 'Picture URL must be a valid HTTP/HTTPS URL if provided'};
    }
  }

  // Generating random ID <GUA><5 random Char><UTC Hex>
  const hexTime = new Date().getTime().toString(16);
  const randString = Math.random().toString(36).substring(2, 7);
  const guardianId = `GUA${randString}${hexTime}`;

  // Validation: govId must be unique
  const govIdCheck = await guardianRef.orderByChild('govId').equalTo(body.govId).once('value');
  if (govIdCheck.val() !== null) {
    return {success: false, message: 'Government ID is not unique'};
  }

  // Process students array
  const studentsValidation = await processStudentsArray(body.students, studentRef);
  if (!studentsValidation.isValid) {
    return {success: false, message: studentsValidation.error!};
  }

  // Populating the Guardian object to add
  const guardianObject: Guardian = {
    name: body.name,
    govId: body.govId,
    // Set pictureUrl to null if not provided, otherwise use the provided value
    pictureUrl: (body.pictureUrl !== undefined && body.pictureUrl !== '') ? body.pictureUrl : null,
    students: studentsValidation.studentsObject || {},
    createdAt: Date.now()
  };

  // Adding guardian to database
  await guardianRef.update({
    [guardianId]: guardianObject
  });

  return {success: true, message: `Guardian ${guardianObject.name}:${guardianId} created`};
};

/**
 * Updates an existing guardian in the Firebase Realtime Database
 */
export const updateGuardian = async (
  req: Request, 
  guardianRef: database.Reference,
  studentRef: database.Reference
): Promise<{success: boolean, message: string}> => {
  if (req.params[0] === '') {
    return {success: false, message: 'No Guardian ID parameter'};
  }

  // Validation: Guardian must exist
  const snapshot = await guardianRef.orderByKey().equalTo(req.params[0]).once('value');
  if (snapshot.val() === null) {
    return {success: false, message: 'Guardian not found'};
  }

  // Validation: if updating govId, new govId must be unique
  if (req.body.govId && req.body.govId !== snapshot.val()[req.params[0]].govId) {
    const govIdCheck = await guardianRef.orderByChild('govId').equalTo(req.body.govId).once('value');
    if (govIdCheck.val() !== null) {
      return {success: false, message: 'Government ID is not unique'};
    }
  }

  console.log('GUARDIAN TO UPDATE', req.body);
  
  // Prevent updating createdAt
  if (req.body.createdAt !== undefined) {
    return {success: false, message: 'Cannot update createdAt field'};
  }
  const updateObj: Partial<Guardian> = {};

  if (req.body.name !== undefined) {
    if (req.body.name === null || req.body.name === '') {
      return {success: false, message: 'Name cannot be empty'};
    }
    updateObj.name = req.body.name;
  }

  if (req.body.govId !== undefined) {
    if (req.body.govId === null || req.body.govId === '') {
      return {success: false, message: 'Government ID cannot be empty'};
    }
    updateObj.govId = req.body.govId;
  }

  if (req.body.pictureUrl !== undefined) {
    if (req.body.pictureUrl === null || req.body.pictureUrl === '') {
      // Allow setting pictureUrl to null
      updateObj.pictureUrl = null;
    } else {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(req.body.pictureUrl)) {
        return {success: false, message: 'Picture URL must be a valid HTTP/HTTPS URL'};
      }
      updateObj.pictureUrl = req.body.pictureUrl;
    }
  }

  // Handle students update logic:
  // - Replace if provided array
  // - Do nothing if undefined
  // - Clear if empty array
  if (req.body.students !== undefined) {
    const studentsValidation = await processStudentsArray(req.body.students, studentRef);
    if (!studentsValidation.isValid) {
      return {success: false, message: studentsValidation.error!};
    }
    updateObj.students = studentsValidation.studentsObject || {};
  }

  // Check if there are any fields to update
  if (Object.keys(updateObj).length === 0) {
    return {success: false, message: 'No valid fields to update'};
  }

  console.log(updateObj);

  const ref = guardianRef.child(req.params[0]);
  await ref.update(updateObj);
  return {success: true, message: `Guardian ${req.params[0]} updated`};
};

/**
 * Deletes a guardian from the Firebase Realtime Database
 */
export const deleteGuardian = async (req: Request, guardianRef: database.Reference): Promise<{success: boolean, message: string}> => {
  if (req.params[0] === '') {
    return {success: false, message: 'No Guardian ID parameter'};
  }

  // Validation: Guardian must exist
  const snapshot = await guardianRef.orderByKey().equalTo(req.params[0]).once('value');
  if (snapshot.val() === null) {
    return {success: false, message: 'Guardian not found'};
  }

  await guardianRef.child(req.params[0]).remove();
  return {success: true, message: `Guardian ${req.params[0]} deleted`};
}; 