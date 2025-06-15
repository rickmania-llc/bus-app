/**
 * Driver interface representing a bus driver
 */
export interface Driver {
  /** Unique identifier from Firebase */
  id: string;
  
  /** Driver's full name */
  name: string;

  /** Driver's government ID number */
  govId: string;
  
  /** Date of birth (Unix timestamp in milliseconds) */
  dob: number;
  
  /** When the driver was hired (Unix timestamp in milliseconds) */
  hireDate: number;
  
  /** URL to driver's profile picture */
  pictureUrl: string | null;
  
  /** When the driver record was created (Unix timestamp in milliseconds) */
  createdAt: number;
} 