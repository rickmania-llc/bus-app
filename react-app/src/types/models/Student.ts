/**
 * Student interface representing a student who uses the bus service
 */
export interface Student {
  /** Unique identifier from Firebase */
  id: string;
  
  /** Student's full name */
  name: string;
  
  /** Date of birth (Unix timestamp in milliseconds) */
  dob: number;
  
  /** Student's home address */
  address: string;
  
  /** URL to student's profile picture */
  pictureUrl: string;
}