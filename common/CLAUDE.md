# Common Module

## Directory Purpose
Shared type definitions and utilities used across both frontend (React) and backend (Firebase Functions) components of the bus tracking system. Ensures type safety and consistency throughout the application.

## Architecture Notes
- TypeScript interfaces for all core entities
- Firebase Realtime Database key pattern (UUID keys stored separately from document data)
- Timestamp fields use Unix milliseconds for consistency
- Reference relationships use boolean flags in nested objects

## Files Overview

### `types/index.ts`
**Purpose:** Central export point for all type definitions in the module
**Key Exports:**
- `Guardian` - Parent/guardian interface
- `Student` - Student interface
- `Driver` - Bus driver interface
- `Route` - Bus route interface with embedded stops
- `Location` - GPS coordinate interface
- `EmbeddedStop` - Stop details within a route
- `StudentStatus` - Student pickup/dropoff status

### `types/Guardian.ts`
**Purpose:** Type definition for parent/guardian entities
**Key Properties:**
- `name: string` - Guardian's full name
- `govId: string` - Guardian's government ID number
- `pictureUrl: string | null` - URL to guardian's profile picture
- `students: object` - Map of student IDs with reference relationships and primary guardian flags

### `types/Student.ts`
**Purpose:** Type definition for student entities
**Key Properties:**
- `name: string` - Student's full name
- `dob: number` - Date of birth (Unix timestamp in milliseconds)
- `address: string` - Student's home address
- `pictureUrl: string` - URL to student's profile picture

### `types/Driver.ts`
**Purpose:** Type definition for bus driver entities
**Key Properties:**
- `name: string` - Driver's full name
- `govId: string` - Driver's government ID number
- `dob: number` - Date of birth (Unix timestamp in milliseconds)
- `hireDate: number` - When the driver was hired (Unix timestamp in milliseconds)
- `pictureUrl: string | null` - URL to driver's profile picture

### `types/Route.ts`
**Purpose:** Type definitions for bus routes and related entities
**Key Types:**
- `Route` - Main route interface with start/end times, locations, stops, and driver assignment
- `EmbeddedStop` - Stop details including expected/actual times, location, and student statuses
- `Location` - GPS coordinate pair (lat/lon)
- `StudentStatus` - Student pickup/dropoff and guardian verification status

### `types/README.md`
**Purpose:** Documentation for the types module explaining the data model and relationships

## Key Dependencies
- No external dependencies (pure TypeScript type definitions)
- Used by both `/react-app` and `/functions` directories

## Common Workflows
1. **Entity Creation:** Frontend creates object matching interface → API validates → Saves to Firebase
2. **Type Sharing:** Import types from this module in both frontend and backend code
3. **Reference Relationships:** Use nested objects with `reference: true` for entity relationships

## Performance Considerations
- Type definitions have no runtime overhead (TypeScript compile-time only)
- Consistent timestamp format (Unix milliseconds) for efficient date operations
- Reference pattern avoids data duplication in Firebase

## Security Notes
- Government ID fields (`govId`) contain sensitive information
- Picture URLs should use secure storage with access controls
- Student information requires guardian relationship verification