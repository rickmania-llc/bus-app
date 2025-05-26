# Bus Tracking System - Core Types

This directory contains TypeScript interface definitions for the core data objects used throughout the Bus Tracking System.

## Core Entities

### Guardian
Represents a parent or guardian responsible for students.

**Fields:**
- `name`: Guardian's full name
- `pictureUrl`: URL to profile picture
- `students`: Object mapping student keys to relationship metadata

### Student
Represents a student who uses the bus service.

**Fields:**
- `name`: Student's full name
- `dob`: Date of birth (Unix timestamp in milliseconds)
- `address`: Home address
- `pictureUrl`: URL to profile picture

### Driver
Represents a bus driver.

**Fields:**
- `name`: Driver's full name
- `dob`: Date of birth (Unix timestamp in milliseconds)
- `hireDate`: Hire date (Unix timestamp in milliseconds)
- `pictureUrl`: URL to profile picture

## Usage

### Importing Types

```typescript
// Import types from the index
import { Guardian, Student, Driver } from '../common/types';

// Or import specific types
import { Student } from '../common/types/Student';
```

### Using the Interfaces

```typescript
import { Student, Guardian } from '../common/types';

// Create a student object
const student: Student = {
  name: "John Doe",
  dob: 1420070400000, // January 1, 2015
  address: "123 Main St, Anytown",
  pictureUrl: "https://example.com/john-doe.jpg"
};

// Create a guardian with student relationships
const guardian: Guardian = {
  name: "Jane Doe",
  pictureUrl: "https://example.com/jane-doe.jpg",
  students: {
    "student_key_123": {
      reference: true,
      isPrimaryGuardian: true
    }
  }
};
```

## File Structure

```
common/types/
├── README.md           # This documentation
├── index.ts           # Main exports
├── Guardian.ts        # Guardian interface
├── Student.ts         # Student interface
└── Driver.ts          # Driver interface
```

## Database Integration

These interfaces are designed for use with **Firebase Realtime Database**:

- **No ID fields**: The database key serves as the unique identifier
- **Direct structure mapping**: Interfaces match the JSON structure stored in the database
- **Reference relationships**: Guardian-student relationships use the reference pattern with metadata

### Example Database Structure

```json
{
  "guardians": {
    "guardian_key_1": {
      "name": "Jane Doe",
      "pictureUrl": "https://example.com/jane.jpg",
      "students": {
        "student_key_123": {
          "reference": true,
          "isPrimaryGuardian": true
        }
      }
    }
  },
  "students": {
    "student_key_123": {
      "name": "John Doe",
      "dob": 1420070400000,
      "address": "123 Main St",
      "pictureUrl": "https://example.com/john.jpg"
    }
  }
}
```

## Design Principles

- **Simplicity**: Only the essential fields needed for each entity
- **Database-first**: Interfaces match the actual database structure
- **Type safety**: Ensure consistent data handling across components
- **Minimal overhead**: No unnecessary abstractions or utility types

## Integration

These types are designed to be used across:
- **Frontend**: React components, state management
- **Backend**: Firebase Functions, API responses
- **Database**: Realtime Database structure validation
- **Testing**: Mock data generation and type safety 