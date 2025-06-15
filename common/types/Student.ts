/**
 * Student interface representing a student who uses the bus service
 * Note: The document key in Firebase Realtime Database serves as the unique identifier
 */
export interface Student {
  /** Student's full name */
  name: string;
  
  /** Date of birth (Unix timestamp in milliseconds) */
  dob: number;
  
  /** Student's home address */
  address: string;
  
  /** URL to student's profile picture */
  pictureUrl: string;
  
  /** When the student record was created (Unix timestamp in milliseconds) */
  createdAt: number;
} 