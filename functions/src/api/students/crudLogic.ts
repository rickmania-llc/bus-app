import { Request } from 'firebase-functions/v2/https';
import { database } from 'firebase-admin';
import { Student } from '../../../../common/types';

/**
 * Parses date of birth input and returns a Unix timestamp
 * Accepts either a Unix timestamp (number) or MM/DD/YYYY format string
 */
const parseDateOfBirth = (dob: any): { isValid: boolean, timestamp?: number, error?: string } => {
  // If it's already a number, validate it as a timestamp
  if (typeof dob === 'number') {
    if (dob <= 0) {
      return { isValid: false, error: 'Date of birth timestamp must be positive' };
    }
    return { isValid: true, timestamp: dob };
  }

  // If it's a string, try to parse as MM/DD/YYYY format
  if (typeof dob === 'string') {
    const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = dob.match(datePattern);
    
    if (!match) {
      return { isValid: false, error: 'Date format must be MM/DD/YYYY (e.g., "01/26/1981" or "2/5/1990")' };
    }

    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Basic validation
    if (month < 1 || month > 12) {
      return { isValid: false, error: 'Month must be between 1 and 12' };
    }
    if (day < 1 || day > 31) {
      return { isValid: false, error: 'Day must be between 1 and 31' };
    }
    if (year < 1900 || year > new Date().getFullYear()) {
      return { isValid: false, error: 'Year must be between 1900 and current year' };
    }

    // Create Date object and validate it exists (handles invalid dates like Feb 30)
    const dateObj = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
      return { isValid: false, error: 'Invalid date (e.g., Feb 30 does not exist)' };
    }

    const timestamp = dateObj.getTime();
    return { isValid: true, timestamp };
  }

  return { isValid: false, error: 'Date of birth must be a number (timestamp) or string in MM/DD/YYYY format' };
};

/**
 * Creates a new student in the Firebase Realtime Database
 */
export const createStudent = async (req: Request, studentRef: database.Reference): Promise<{success: boolean, message: string}> => {
  console.log('In student create function');
  console.log(req.body);
  
  const body = req.body;
  // pictureUrl is now optional
  const requiredFields = ['name', 'dob', 'address'];
  
  // Basic validation for required fields
  for (const field of requiredFields) {
    console.log(`testing ${field}`);
    console.log(body[field]);
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return {success: false, message: `Missing required field: ${field}`};
    }
  }

  // Additional validation for dob (date of birth should be a valid timestamp)
  const dobValidation = parseDateOfBirth(body.dob);
  if (!dobValidation.isValid) {
    return {success: false, message: dobValidation.error!};
  }

  // Additional validation for pictureUrl if provided (basic URL format check)
  if (body.pictureUrl !== undefined && body.pictureUrl !== null && body.pictureUrl !== '') {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(body.pictureUrl)) {
      return {success: false, message: 'Picture URL must be a valid HTTP/HTTPS URL if provided'};
    }
  }

  // Generating random ID <STU><5 random Char><UTC Hex>
  const hexTime = new Date().getTime().toString(16);
  const randString = Math.random().toString(36).substring(2, 7);
  const studentId = `STU${randString}${hexTime}`;

  // Validation: name must be unique
  const nameCheck = await studentRef.orderByChild('name').equalTo(body.name).once('value');
  if (nameCheck.val() !== null) {
    return {success: false, message: 'Student name is not unique'};
  }

  // Populating the Student object to add
  const studentObject: Student = {
    name: body.name,
    dob: dobValidation.timestamp!,
    address: body.address,
    // Set pictureUrl to null if not provided, otherwise use the provided value
    pictureUrl: (body.pictureUrl !== undefined && body.pictureUrl !== '') ? body.pictureUrl : null,
    createdAt: Date.now()
  };

  // Adding student to database
  await studentRef.update({
    [studentId]: studentObject
  });

  return {success: true, message: `Student ${studentObject.name}:${studentId} created`};
};

/**
 * Updates an existing student in the Firebase Realtime Database
 */
export const updateStudent = async (req: Request, studentRef: database.Reference): Promise<{success: boolean, message: string}> => {
  if (req.params[0] === '') {
    return {success: false, message: 'No Student ID parameter'};
  }

  // Validation: Student must exist
  const snapshot = await studentRef.orderByKey().equalTo(req.params[0]).once('value');
  if (snapshot.val() === null) {
    return {success: false, message: 'Student not found'};
  }

  // Validation: if updating name, new name must be unique
  if (req.body.name && req.body.name !== snapshot.val()[req.params[0]].name) {
    const nameCheck = await studentRef.orderByChild('name').equalTo(req.body.name).once('value');
    if (nameCheck.val() !== null) {
      return {success: false, message: 'Student name is not unique'};
    }
  }

  console.log('STUDENT TO UPDATE', req.body);
  const updateObj: Partial<Student> = {};

  // Prevent updating createdAt
  if (req.body.createdAt !== undefined) {
    return {success: false, message: 'Cannot update createdAt field'};
  }

  if (req.body.name !== undefined) {
    if (req.body.name === null || req.body.name === '') {
      return {success: false, message: 'Name cannot be empty'};
    }
    updateObj.name = req.body.name;
  }

  if (req.body.dob !== undefined) {
    const dobValidation = parseDateOfBirth(req.body.dob);
    if (!dobValidation.isValid) {
      return {success: false, message: dobValidation.error!};
    }
    updateObj.dob = dobValidation.timestamp!;
  }

  if (req.body.address !== undefined) {
    if (req.body.address === null || req.body.address === '') {
      return {success: false, message: 'Address cannot be empty'};
    }
    updateObj.address = req.body.address;
  }

  if (req.body.pictureUrl !== undefined) {
    if (req.body.pictureUrl === null || req.body.pictureUrl === '') {
      return {success: false, message: 'Picture URL cannot be empty'};
    }
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(req.body.pictureUrl)) {
      return {success: false, message: 'Picture URL must be a valid HTTP/HTTPS URL'};
    }
    updateObj.pictureUrl = req.body.pictureUrl;
  }

  // Check if there are any fields to update
  if (Object.keys(updateObj).length === 0) {
    return {success: false, message: 'No valid fields to update'};
  }

  console.log(updateObj);

  const ref = studentRef.child(req.params[0]);
  await ref.update(updateObj);
  return {success: true, message: `Student ${req.params[0]} updated`};
};

/**
 * Deletes a student from the Firebase Realtime Database
 */
export const deleteStudent = async (req: Request, studentRef: database.Reference, guardianRef?: database.Reference): Promise<{success: boolean, message: string}> => {
  if (req.params[0] === '') {
    return {success: false, message: 'No Student ID parameter'};
  }

  // Validation: Student must exist
  const snapshot = await studentRef.orderByKey().equalTo(req.params[0]).once('value');
  if (snapshot.val() === null) {
    return {success: false, message: 'Student not found'};
  }

  const studentId = req.params[0];

  // Remove student from database
  await studentRef.child(studentId).remove();

  // If guardianRef is provided, remove this student from all guardians that reference them
  if (guardianRef) {
    await removeStudentFromGuardians(studentId, guardianRef);
  }

  return {success: true, message: `Student ${studentId} deleted`};
};

/**
 * Utility function to remove a deleted student from all guardians that reference them
 */
export const removeStudentFromGuardians = async (
  studentId: string,
  guardianRef: database.Reference
): Promise<void> => {
  // Get all guardians
  const snapshot = await guardianRef.once('value');
  
  if (snapshot.val() !== null) {
    const guardians = snapshot.val();
    const updates: any = {};
    
    for (const guardianId in guardians) {
      const guardian = guardians[guardianId];
      if (guardian.students && guardian.students[studentId]) {
        // Remove the student reference from this guardian
        updates[`${guardianId}/students/${studentId}`] = null;
      }
    }
    
    // Apply all updates at once
    if (Object.keys(updates).length > 0) {
      await guardianRef.update(updates);
      console.log(`Removed student ${studentId} from ${Object.keys(updates).length} guardian(s)`);
    }
  }
}; 