import { Request } from 'firebase-functions/v2/https';
import { database } from 'firebase-admin';
import { Route } from '../../../../common/types';

/**
 * Validates latitude and longitude coordinates
 */
const isValidCoordinate = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

/**
 * Validates a timestamp (epoch milliseconds)
 */
const isValidTimestamp = (timestamp: number): boolean => {
  return timestamp > 0 && timestamp <= Date.now() + (365 * 24 * 60 * 60 * 1000); // Up to 1 year in future
};

/**
 * Validates a Location object
 */
const validateLocation = (location: any, fieldName: string): { isValid: boolean, error?: string } => {
  if (!location || typeof location !== 'object') {
    return { isValid: false, error: `${fieldName} must be an object with lat and lon properties` };
  }

  if (typeof location.lat !== 'number' || typeof location.lon !== 'number') {
    return { isValid: false, error: `${fieldName} lat and lon must be numbers` };
  }

  if (!isValidCoordinate(location.lat, location.lon)) {
    return { isValid: false, error: `${fieldName} contains invalid coordinates (lat: -90 to 90, lon: -180 to 180)` };
  }

  return { isValid: true };
};

/**
 * Validates a StudentStatus object
 */
const validateStudentStatus = (status: any, studentId: string): { isValid: boolean, error?: string } => {
  if (!status || typeof status !== 'object') {
    return { isValid: false, error: `Student status for ${studentId} must be an object` };
  }

  if (typeof status.reference !== 'boolean') {
    return { isValid: false, error: `Student ${studentId} reference must be a boolean` };
  }

  if (typeof status.droppedOrPicked !== 'boolean') {
    return { isValid: false, error: `Student ${studentId} droppedOrPicked must be a boolean` };
  }

  if (typeof status.guardianVerified !== 'boolean') {
    return { isValid: false, error: `Student ${studentId} guardianVerified must be a boolean` };
  }

  return { isValid: true };
};

/**
 * Validates an EmbeddedStop object
 */
const validateStop = (stop: any, index: number): { isValid: boolean, error?: string } => {
  if (!stop || typeof stop !== 'object') {
    return { isValid: false, error: `Stop ${index} must be an object` };
  }

  // Validate expectedTime (can be null or number)
  if (stop.expectedTime !== null && (typeof stop.expectedTime !== 'number' || !isValidTimestamp(stop.expectedTime))) {
    return { isValid: false, error: `Stop ${index} expectedTime must be null or a valid timestamp` };
  }

  // Validate actualTime (can be null or number)
  if (stop.actualTime !== null && (typeof stop.actualTime !== 'number' || !isValidTimestamp(stop.actualTime))) {
    return { isValid: false, error: `Stop ${index} actualTime must be null or a valid timestamp` };
  }

  // Validate isTemplate
  if (typeof stop.isTemplate !== 'boolean') {
    return { isValid: false, error: `Stop ${index} isTemplate must be a boolean` };
  }

  // Validate location
  const locationValidation = validateLocation(stop.location, `Stop ${index} location`);
  if (!locationValidation.isValid) {
    return locationValidation;
  }

  // Validate students object
  if (!stop.students || typeof stop.students !== 'object' || Array.isArray(stop.students)) {
    return { isValid: false, error: `Stop ${index} students must be an object` };
  }

  // Validate each student status
  for (const [studentId, studentStatus] of Object.entries(stop.students)) {
    const statusValidation = validateStudentStatus(studentStatus, studentId);
    if (!statusValidation.isValid) {
      return { isValid: false, error: `Stop ${index}: ${statusValidation.error}` };
    }
  }

  return { isValid: true };
};

/**
 * Creates a new route in the Firebase Realtime Database
 */
export const createRoute = async (
  req: Request, 
  routeRef: database.Reference,
  driverRef: database.Reference,
  studentRef: database.Reference
): Promise<{success: boolean, message: string}> => {
  console.log('In route create function');
  console.log(req.body);
  
  const body = req.body;
  
  // Required fields validation
  const requiredFields = ['isTemplate', 'isPickUp'];
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null) {
      return {success: false, message: `Missing required field: ${field}`};
    }
  }

  // Validate boolean fields
  if (typeof body.isTemplate !== 'boolean') {
    return {success: false, message: 'isTemplate must be a boolean'};
  }

  if (typeof body.isPickUp !== 'boolean') {
    return {success: false, message: 'isPickUp must be a boolean'};
  }

  // For non-templates, certain fields might be required (business logic validation)
  if (!body.isTemplate) {
    if (body.startTime !== null && (typeof body.startTime !== 'number' || !isValidTimestamp(body.startTime))) {
      return {success: false, message: 'startTime must be null or a valid timestamp for non-template routes'};
    }
    
    if (body.finishTime !== null && (typeof body.finishTime !== 'number' || !isValidTimestamp(body.finishTime))) {
      return {success: false, message: 'finishTime must be null or a valid timestamp for non-template routes'};
    }
  }

  // Validate timestamps if provided
  if (body.startTime !== undefined && body.startTime !== null) {
    if (typeof body.startTime !== 'number' || !isValidTimestamp(body.startTime)) {
      return {success: false, message: 'startTime must be a valid timestamp'};
    }
  }

  if (body.finishTime !== undefined && body.finishTime !== null) {
    if (typeof body.finishTime !== 'number' || !isValidTimestamp(body.finishTime)) {
      return {success: false, message: 'finishTime must be a valid timestamp'};
    }
  }

  // Validate start and finish time relationship if both provided
  if (body.startTime && body.finishTime && body.startTime >= body.finishTime) {
    return {success: false, message: 'finishTime must be after startTime'};
  }

  // Validate startLocation
  if (body.startLocation !== undefined) {
    const startLocationValidation = validateLocation(body.startLocation, 'startLocation');
    if (!startLocationValidation.isValid) {
      return {success: false, message: startLocationValidation.error!};
    }
  }

  // Validate endLocation
  if (body.endLocation !== undefined) {
    const endLocationValidation = validateLocation(body.endLocation, 'endLocation');
    if (!endLocationValidation.isValid) {
      return {success: false, message: endLocationValidation.error!};
    }
  }

  // Validate stops array
  if (body.stops !== undefined) {
    if (!Array.isArray(body.stops)) {
      return {success: false, message: 'stops must be an array'};
    }

    for (let i = 0; i < body.stops.length; i++) {
      const stopValidation = validateStop(body.stops[i], i);
      if (!stopValidation.isValid) {
        return {success: false, message: stopValidation.error!};
      }

      // Validate that referenced students exist
      for (const studentId of Object.keys(body.stops[i].students)) {
        const studentSnapshot = await studentRef.child(studentId).once('value');
        if (!studentSnapshot.exists()) {
          return {success: false, message: `Student ${studentId} referenced in stop ${i} does not exist`};
        }
      }
    }
  }

  // Validate driverId if provided
  if (body.driverId !== undefined && body.driverId !== null) {
    const driverSnapshot = await driverRef.child(body.driverId).once('value');
    if (!driverSnapshot.exists()) {
      return {success: false, message: 'Referenced driver does not exist'};
    }
  }

  // Generate route ID: ROU<5randomChars><hexTimestamp>
  const hexTime = new Date().getTime().toString(16);
  const randString = Math.random().toString(36).substring(2, 7);
  const routeId = `ROU${randString}${hexTime}`;

  // Create the route object
  const routeObject: Route = {
    startTime: body.startTime ?? null,
    finishTime: body.finishTime ?? null,
    isTemplate: body.isTemplate,
    isPickUp: body.isPickUp,
    startLocation: body.startLocation ?? {},
    endLocation: body.endLocation ?? {},
    stops: body.stops ?? [],
    driverId: body.driverId ?? null,
    currentLocationId: body.currentLocationId ?? null
  };

  // Add route to database
  await routeRef.update({
    [routeId]: routeObject
  });

  return {success: true, message: `Route ${routeId} created successfully`};
};

/**
 * Updates an existing route in the Firebase Realtime Database
 */
export const updateRoute = async (
  req: Request, 
  routeRef: database.Reference,
  driverRef: database.Reference,
  studentRef: database.Reference
): Promise<{success: boolean, message: string}> => {
  if (req.params[0] === '') {
    return {success: false, message: 'No Route ID parameter'};
  }

  const routeId = req.params[0];

  // Validation: Route must exist
  const snapshot = await routeRef.child(routeId).once('value');
  if (!snapshot.exists()) {
    return {success: false, message: 'Route not found'};
  }

  const currentRoute = snapshot.val() as Route;
  const updateObj: Partial<Route> = {};

  // Validate and update fields if provided
  if (req.body.startTime !== undefined) {
    if (req.body.startTime !== null && (typeof req.body.startTime !== 'number' || !isValidTimestamp(req.body.startTime))) {
      return {success: false, message: 'startTime must be null or a valid timestamp'};
    }
    updateObj.startTime = req.body.startTime;
  }

  if (req.body.finishTime !== undefined) {
    if (req.body.finishTime !== null && (typeof req.body.finishTime !== 'number' || !isValidTimestamp(req.body.finishTime))) {
      return {success: false, message: 'finishTime must be null or a valid timestamp'};
    }
    updateObj.finishTime = req.body.finishTime;
  }

  if (req.body.isTemplate !== undefined) {
    if (typeof req.body.isTemplate !== 'boolean') {
      return {success: false, message: 'isTemplate must be a boolean'};
    }
    updateObj.isTemplate = req.body.isTemplate;
  }

  if (req.body.isPickUp !== undefined) {
    if (typeof req.body.isPickUp !== 'boolean') {
      return {success: false, message: 'isPickUp must be a boolean'};
    }
    updateObj.isPickUp = req.body.isPickUp;
  }

  if (req.body.startLocation !== undefined) {
    const startLocationValidation = validateLocation(req.body.startLocation, 'startLocation');
    if (!startLocationValidation.isValid) {
      return {success: false, message: startLocationValidation.error!};
    }
    updateObj.startLocation = req.body.startLocation;
  }

  if (req.body.endLocation !== undefined) {
    const endLocationValidation = validateLocation(req.body.endLocation, 'endLocation');
    if (!endLocationValidation.isValid) {
      return {success: false, message: endLocationValidation.error!};
    }
    updateObj.endLocation = req.body.endLocation;
  }

  if (req.body.stops !== undefined) {
    if (!Array.isArray(req.body.stops)) {
      return {success: false, message: 'stops must be an array'};
    }

    // Validate all stops
    for (let i = 0; i < req.body.stops.length; i++) {
      const stopValidation = validateStop(req.body.stops[i], i);
      if (!stopValidation.isValid) {
        return {success: false, message: stopValidation.error!};
      }

      // Validate that referenced students exist
      for (const studentId of Object.keys(req.body.stops[i].students)) {
        const studentSnapshot = await studentRef.child(studentId).once('value');
        if (!studentSnapshot.exists()) {
          return {success: false, message: `Student ${studentId} referenced in stop ${i} does not exist`};
        }
      }
    }

    updateObj.stops = req.body.stops;
  }

  if (req.body.driverId !== undefined) {
    if (req.body.driverId !== null) {
      const driverSnapshot = await driverRef.child(req.body.driverId).once('value');
      if (!driverSnapshot.exists()) {
        return {success: false, message: 'Referenced driver does not exist'};
      }
    }
    updateObj.driverId = req.body.driverId;
  }

  if (req.body.currentLocationId !== undefined) {
    updateObj.currentLocationId = req.body.currentLocationId;
  }

  // Validate start and finish time relationship after updates
  const newStartTime = updateObj.startTime !== undefined ? updateObj.startTime : currentRoute.startTime;
  const newFinishTime = updateObj.finishTime !== undefined ? updateObj.finishTime : currentRoute.finishTime;
  
  if (newStartTime && newFinishTime && newStartTime >= newFinishTime) {
    return {success: false, message: 'finishTime must be after startTime'};
  }

  // Check if there are any fields to update
  if (Object.keys(updateObj).length === 0) {
    return {success: false, message: 'No valid fields to update'};
  }

  // Update the route
  await routeRef.child(routeId).update(updateObj);

  return {success: true, message: `Route ${routeId} updated successfully`};
};

/**
 * Deletes a route from the Firebase Realtime Database
 */
export const deleteRoute = async (
  req: Request, 
  routeRef: database.Reference
): Promise<{success: boolean, message: string}> => {
  if (req.params[0] === '') {
    return {success: false, message: 'No Route ID parameter'};
  }

  const routeId = req.params[0];

  // Validation: Route must exist
  const snapshot = await routeRef.child(routeId).once('value');
  if (!snapshot.exists()) {
    return {success: false, message: 'Route not found'};
  }

  // Delete the route
  await routeRef.child(routeId).remove();

  return {success: true, message: `Route ${routeId} deleted successfully`};
}; 