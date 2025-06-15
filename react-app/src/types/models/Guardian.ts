/**
 * Guardian interface representing a parent or guardian responsible for students
 */
export interface Guardian {
  /** Unique identifier from Firebase */
  id: string;

  /** Guardian's full name */
  name: string;

  /** Guardian's government ID number */
  govId: string;
  
  /** URL to guardian's profile picture */
  pictureUrl: string | null;
  
  /** Students this guardian is responsible for */
  students: {
    [studentId: string]: {
      /** Always true, indicates this is a reference relationship */
      reference: true;
      /** Whether this guardian is the primary guardian for the student */
      isPrimaryGuardian: boolean;
    };
  };
  
  /** When the guardian record was created (Unix timestamp in milliseconds) */
  createdAt: number;
} 