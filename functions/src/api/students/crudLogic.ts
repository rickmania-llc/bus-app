import { Request } from 'firebase-functions/v2/https';
import { database } from 'firebase-admin';
import { Student } from '../../../../common/types';

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
  if (typeof body.dob !== 'number' || body.dob <= 0) {
    return {success: false, message: 'Date of birth must be a valid timestamp'};
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
    dob: body.dob,
    address: body.address,
    // Set pictureUrl to null if not provided, otherwise use the provided value
    pictureUrl: (body.pictureUrl !== undefined && body.pictureUrl !== '') ? body.pictureUrl : null
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

  if (req.body.name !== undefined) {
    if (req.body.name === null || req.body.name === '') {
      return {success: false, message: 'Name cannot be empty'};
    }
    updateObj.name = req.body.name;
  }

  if (req.body.dob !== undefined) {
    if (typeof req.body.dob !== 'number' || req.body.dob <= 0) {
      return {success: false, message: 'Date of birth must be a valid timestamp'};
    }
    updateObj.dob = req.body.dob;
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
export const deleteStudent = async (req: Request, studentRef: database.Reference): Promise<{success: boolean, message: string}> => {
  if (req.params[0] === '') {
    return {success: false, message: 'No Student ID parameter'};
  }

  // Validation: Student must exist
  const snapshot = await studentRef.orderByKey().equalTo(req.params[0]).once('value');
  if (snapshot.val() === null) {
    return {success: false, message: 'Student not found'};
  }

  await studentRef.child(req.params[0]).remove();
  return {success: true, message: `Student ${req.params[0]} deleted`};
}; 