/**
 * Route-related interfaces for the bus tracking system
 */

export interface Location {
  lat: number;
  lon: number;
}

export interface StudentStatus {
  /** Reference to the student document key */
  studentId: string;
  /** Whether the student was picked up */
  pickedUp: boolean;
  /** Timestamp when picked up (Unix milliseconds) */
  pickedUpTime: number | null;
  /** Whether the student was dropped off */
  droppedOff: boolean;
  /** Timestamp when dropped off (Unix milliseconds) */
  droppedOffTime: number | null;
  /** Whether the guardian was verified during pickup/dropoff */
  guardianVerified: boolean;
  /** ID of the guardian who picked up/dropped off */
  guardianId: string | null;
}

export interface EmbeddedStop {
  /** The stop location coordinates */
  location: Location;
  /** Optional stop name/description */
  name?: string;
  /** Expected arrival time (Unix timestamp in milliseconds) */
  expectedTime: number;
  /** Actual arrival time (Unix timestamp in milliseconds) */
  actualTime: number | null;
  /** Status of students at this stop */
  students: {
    [studentId: string]: StudentStatus;
  };
}

export interface Route {
  /** Unique identifier from Firebase */
  id: string;
  /** Route name/identifier (e.g., "Morning Route A") */
  name: string;
  /** Scheduled start time (Unix timestamp in milliseconds) */
  startTime: number;
  /** Scheduled end time (Unix timestamp in milliseconds) */
  endTime: number;
  /** Actual start time when driver began route (Unix timestamp in milliseconds) */
  actualStartTime: number | null;
  /** Actual end time when driver completed route (Unix timestamp in milliseconds) */
  actualEndTime: number | null;
  /** Current location of the bus */
  currentLocation: Location | null;
  /** Ordered list of stops with embedded student information */
  stops: EmbeddedStop[];
  /** Reference to the assigned driver document key */
  driver: string | null;
  /** Whether this is a template or an active instance */
  isTemplate: boolean;
  /** For instances: reference to the template this was created from */
  templateId: string | null;
  /** For instances: the date this route is for (YYYY-MM-DD format) */
  date: string | null;
  
  /** When the route record was created (Unix timestamp in milliseconds) */
  createdAt: number;
}