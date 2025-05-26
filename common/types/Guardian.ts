/**
 * Guardian interface representing a parent or guardian responsible for students
 * Note: The document key in Firebase Realtime Database serves as the unique identifier
 */
export interface Guardian {
  /** Guardian's full name */
  name: string;
  
  /** URL to guardian's profile picture */
  pictureUrl: string;
  
  /** Students this guardian is responsible for */
  students: {
    [studentId: string]: {
      /** Always true, indicates this is a reference relationship */
      reference: true;
      /** Whether this guardian is the primary guardian for the student */
      isPrimaryGuardian: boolean;
    };
  };
} 