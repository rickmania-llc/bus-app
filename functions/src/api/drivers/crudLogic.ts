import { Request } from 'firebase-functions/v2/https';
import { database } from 'firebase-admin';
import { Driver } from '../../../../common/types';

/**
 * Parses date input and returns a Unix timestamp
 * Accepts either a Unix timestamp (number) or MM/DD/YYYY format string
 */
const parseDate = (date: any, fieldName: string): { isValid: boolean, timestamp?: number, error?: string } => {
  // If it's already a number, validate it as a timestamp
  if (typeof date === 'number') {
    if (date <= 0) {
      return { isValid: false, error: `${fieldName} timestamp must be positive` };
    }
    return { isValid: true, timestamp: date };
  }

  // If it's a string, try to parse as MM/DD/YYYY format
  if (typeof date === 'string') {
    const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = date.match(datePattern);
    
    if (!match) {
      return { isValid: false, error: `${fieldName} format must be MM/DD/YYYY (e.g., "01/26/1981" or "2/5/1990")` };
    }

    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Basic validation
    if (month < 1 || month > 12) {
      return { isValid: false, error: `${fieldName} month must be between 1 and 12` };
    }
    if (day < 1 || day > 31) {
      return { isValid: false, error: `${fieldName} day must be between 1 and 31` };
    }
    if (year < 1900 || year > new Date().getFullYear()) {
      return { isValid: false, error: `${fieldName} year must be between 1900 and current year` };
    }

    // Create Date object and validate it exists (handles invalid dates like Feb 30)
    const dateObj = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
      return { isValid: false, error: `Invalid ${fieldName} (e.g., Feb 30 does not exist)` };
    }

    const timestamp = dateObj.getTime();
    return { isValid: true, timestamp };
  }

  return { isValid: false, error: `${fieldName} must be a number (timestamp) or string in MM/DD/YYYY format` };
};

/**
 * Creates a new driver in the Firebase Realtime Database
 */
export const createDriver = async (
  req: Request, 
  driverRef: database.Reference
): Promise<{success: boolean, message: string}> => {
  console.log('In driver create function');
  console.log(req.body);
  
  const body = req.body;
  // pictureUrl is optional
  const requiredFields = ['name', 'govId', 'dob', 'hireDate'];
  
  // Basic validation for required fields
  for (const field of requiredFields) {
    console.log(`testing ${field}`);
    console.log(body[field]);
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return {success: false, message: `Missing required field: ${field}`};
    }
  }

  // Validation for dob (date of birth)
  const dobValidation = parseDate(body.dob, 'Date of birth');
  if (!dobValidation.isValid) {
    return {success: false, message: dobValidation.error!};
  }

  // Validation for hireDate
  const hireDateValidation = parseDate(body.hireDate, 'Hire date');
  if (!hireDateValidation.isValid) {
    return {success: false, message: hireDateValidation.error!};
  }

  // Additional validation for pictureUrl if provided (basic URL format check)
  if (body.pictureUrl !== undefined && body.pictureUrl !== null && body.pictureUrl !== '') {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(body.pictureUrl)) {
      return {success: false, message: 'Picture URL must be a valid HTTP/HTTPS URL if provided'};
    }
  }

  // Generating random ID <DRI><5 random Char><UTC Hex>
  const hexTime = new Date().getTime().toString(16);
  const randString = Math.random().toString(36).substring(2, 7);
  const driverId = `DRI${randString}${hexTime}`;

  // Validation: govId must be unique
  const govIdCheck = await driverRef.orderByChild('govId').equalTo(body.govId).once('value');
  if (govIdCheck.val() !== null) {
    return {success: false, message: 'Government ID is not unique'};
  }

  // Populating the Driver object to add
  const driverObject: Driver = {
    name: body.name,
    govId: body.govId,
    dob: dobValidation.timestamp!,
    hireDate: hireDateValidation.timestamp!,
    // Set pictureUrl to null if not provided, otherwise use the provided value
    pictureUrl: (body.pictureUrl !== undefined && body.pictureUrl !== '') ? body.pictureUrl : null,
    createdAt: Date.now()
  };

  // Adding driver to database
  await driverRef.update({
    [driverId]: driverObject
  });

  return {success: true, message: `Driver ${driverObject.name}:${driverId} created`};
};

/**
 * Updates an existing driver in the Firebase Realtime Database
 */
export const updateDriver = async (
  req: Request, 
  driverRef: database.Reference
): Promise<{success: boolean, message: string}> => {
  if (req.params[0] === '') {
    return {success: false, message: 'No Driver ID parameter'};
  }

  // Validation: Driver must exist
  const snapshot = await driverRef.orderByKey().equalTo(req.params[0]).once('value');
  if (snapshot.val() === null) {
    return {success: false, message: 'Driver not found'};
  }

  // Validation: if updating govId, new govId must be unique
  if (req.body.govId && req.body.govId !== snapshot.val()[req.params[0]].govId) {
    const govIdCheck = await driverRef.orderByChild('govId').equalTo(req.body.govId).once('value');
    if (govIdCheck.val() !== null) {
      return {success: false, message: 'Government ID is not unique'};
    }
  }

  console.log('DRIVER TO UPDATE', req.body);
  
  // Prevent updating createdAt
  if (req.body.createdAt !== undefined) {
    return {success: false, message: 'Cannot update createdAt field'};
  }
  const updateObj: Partial<Driver> = {};

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

  if (req.body.dob !== undefined) {
    const dobValidation = parseDate(req.body.dob, 'Date of birth');
    if (!dobValidation.isValid) {
      return {success: false, message: dobValidation.error!};
    }
    updateObj.dob = dobValidation.timestamp!;
  }

  if (req.body.hireDate !== undefined) {
    const hireDateValidation = parseDate(req.body.hireDate, 'Hire date');
    if (!hireDateValidation.isValid) {
      return {success: false, message: hireDateValidation.error!};
    }
    updateObj.hireDate = hireDateValidation.timestamp!;
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

  // Check if there are any fields to update
  if (Object.keys(updateObj).length === 0) {
    return {success: false, message: 'No valid fields to update'};
  }

  console.log(updateObj);

  const ref = driverRef.child(req.params[0]);
  await ref.update(updateObj);
  return {success: true, message: `Driver ${req.params[0]} updated`};
};

/**
 * Deletes a driver from the Firebase Realtime Database
 * Also removes driver references from all routes
 */
export const deleteDriver = async (
  req: Request, 
  driverRef: database.Reference,
  routeRef: database.Reference
): Promise<{success: boolean, message: string}> => {
  if (req.params[0] === '') {
    return {success: false, message: 'No Driver ID parameter'};
  }

  // Validation: Driver must exist
  const snapshot = await driverRef.orderByKey().equalTo(req.params[0]).once('value');
  if (snapshot.val() === null) {
    return {success: false, message: 'Driver not found'};
  }

  const driverId = req.params[0];

  // Remove driver references from all routes
  await removeDriverFromRoutes(driverId, routeRef);

  // Delete the driver
  await driverRef.child(driverId).remove();
  return {success: true, message: `Driver ${driverId} deleted`};
};

/**
 * Utility function to remove driver references from all routes
 */
export const removeDriverFromRoutes = async (
  driverId: string,
  routeRef: database.Reference
): Promise<void> => {
  // Find all routes that reference this driver
  const routeSnapshot = await routeRef.orderByChild('driverId').equalTo(driverId).once('value');
  const routes = routeSnapshot.val();

  if (routes) {
    const updates: { [key: string]: any } = {};
    
    // Set driverId to null for all routes that reference this driver
    Object.keys(routes).forEach(routeId => {
      updates[`${routeId}/driverId`] = null;
    });

    await routeRef.update(updates);
  }
}; 