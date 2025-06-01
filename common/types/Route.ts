/**
 * Location interface for GPS coordinates
 */
export interface Location {
  /** Latitude coordinate */
  lat: number;
  /** Longitude coordinate */
  lon: number;
}

/**
 * Student status at a specific stop
 */
export interface StudentStatus {
  /** Always true - indicates this is a reference relationship */
  reference: boolean;
  /** Whether the student was successfully picked up/dropped off */
  droppedOrPicked: boolean;
  /** Whether a guardian verified the pickup/dropoff */
  guardianVerified: boolean;
}

/**
 * Embedded stop within a route
 */
export interface EmbeddedStop {
  /** When the bus was expected to arrive (Unix timestamp in milliseconds, null for templates) */
  expectedTime: number | null;
  /** When the bus actually arrived (Unix timestamp in milliseconds, null if not yet arrived) */
  actualTime: number | null;
  /** Boolean indicating if this is a template stop or an actual instance */
  isTemplate: boolean;
  /** GPS coordinates of the stop */
  location: Location;
  /** Object map where keys are student UUIDs and values contain student status at this stop */
  students: { [studentId: string]: StudentStatus };
}

/**
 * Route interface representing a bus route with embedded stop information
 * Note: The document key in Firebase Realtime Database serves as the unique identifier
 */
export interface Route {
  /** When the route started/should start (Unix timestamp in milliseconds, null for templates) */
  startTime: number | null;
  
  /** When the route finished/should finish (Unix timestamp in milliseconds, null for templates) */
  finishTime: number | null;
  
  /** Boolean indicating if this is a template or an actual instance */
  isTemplate: boolean;
  
  /** Boolean indicating if this is a pickup route (true) or dropoff route (false) */
  isPickUp: boolean;
  
  /** GPS coordinates where the route begins */
  startLocation: Location;
  
  /** GPS coordinates where the route ends */
  endLocation: Location;
  
  /** Array of embedded stop objects */
  stops: EmbeddedStop[];
  
  /** Reference to the driver assigned to this route (null for templates) */
  driverId: string | null;
  
  /** Reference to the current location data for active routes (null for templates and completed routes) */
  currentLocationId: string | null;
} 