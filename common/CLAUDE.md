# Common Types and Utilities - Shared Data Models

## Directory Purpose
The common directory contains shared TypeScript type definitions and utilities used across both the frontend React application and backend Firebase Cloud Functions. This ensures consistent data models, reduces code duplication, and provides a single source of truth for the application's core data structures in the multi-tenant bus transportation tracking system.

## Architecture Overview

### Design Pattern
**Shared Library Pattern**: Centralized type definitions that are imported by both frontend and backend code to ensure data consistency and prevent interface mismatches across service boundaries.

### Component Structure
```
common/
├── types/                    # TypeScript interface definitions
│   ├── index.ts             # Main export hub for all types
│   ├── Student.ts           # Student entity interface
│   ├── Guardian.ts          # Guardian entity interface  
│   ├── Driver.ts            # Driver entity interface
│   └── Route.ts             # Route, Location, and Stop interfaces
└── CLAUDE.md                # This documentation file
```

### Dependencies
- **Internal**: No internal dependencies (pure TypeScript interfaces)
- **External**: No external package dependencies (only TypeScript compiler)

## Core Functionality

### Primary Responsibilities
1. **Data Model Definition**: Provides TypeScript interfaces for all core entities
2. **Type Safety**: Ensures consistent typing between frontend and backend
3. **Documentation**: Self-documenting interfaces with comprehensive JSDoc comments
4. **Multi-tenant Support**: Entity designs support tenant isolation patterns

### Key Interfaces

#### Student Interface
**Purpose**: Represents a student who uses the bus transportation service
**Methods/Properties**:
```typescript
interface Student {
  name: string;           // Student's full name
  dob: number;           // Date of birth (Unix timestamp in milliseconds)
  address: string;       // Student's home address
  pictureUrl: string;    // URL to student's profile picture
  createdAt: number;     // When the record was created (Unix timestamp)
}
```

#### Guardian Interface
**Purpose**: Represents a parent or guardian responsible for one or more students
**Methods/Properties**:
```typescript
interface Guardian {
  name: string;                    // Guardian's full name
  govId: string;                  // Government ID number
  pictureUrl: string | null;      // URL to guardian's profile picture
  students: {                     // Students this guardian is responsible for
    [studentId: string]: {
      reference: true;            // Always true (reference relationship)
      isPrimaryGuardian: boolean; // Whether this is the primary guardian
    };
  };
  createdAt: number;             // When the record was created
}
```

#### Driver Interface
**Purpose**: Represents a bus driver in the transportation system
**Methods/Properties**:
```typescript
interface Driver {
  name: string;              // Driver's full name
  govId: string;            // Government ID number
  dob: number;              // Date of birth (Unix timestamp)
  hireDate: number;         // When the driver was hired (Unix timestamp)
  pictureUrl: string | null; // URL to driver's profile picture
  createdAt: number;        // When the record was created
}
```

#### Route Interface
**Purpose**: Represents a bus route with embedded stop information and GPS tracking
**Methods/Properties**:
```typescript
interface Route {
  startTime: number | null;      // Route start time (null for templates)
  finishTime: number | null;     // Route finish time (null for templates)
  isTemplate: boolean;           // Whether this is a template or instance
  isPickUp: boolean;            // true for pickup, false for dropoff
  startLocation: Location;       // GPS coordinates where route begins
  endLocation: Location;         // GPS coordinates where route ends
  stops: EmbeddedStop[];        // Array of embedded stop objects
  driverId: string | null;      // Assigned driver (null for templates)
  currentLocationId: string | null; // Current location tracking
  createdAt: number;            // When the record was created
}
```

## File Descriptions

### types/index.ts
**Purpose**: Central export hub that provides a clean interface for importing all type definitions
**Exports**:
- `Guardian`: Guardian entity interface
- `Student`: Student entity interface  
- `Driver`: Driver entity interface
- `Route`: Route entity interface with related types
- `Location`: GPS coordinate interface
- `EmbeddedStop`: Route stop interface
- `StudentStatus`: Student pickup/dropoff status interface

**Key Features**:
- Re-exports all entity interfaces for convenient importing
- Comprehensive JSDoc documentation explaining the data model
- Single import location for all shared types

### types/Student.ts
**Purpose**: Student entity interface definition with comprehensive field documentation
**Exports**:
- `Student`: Complete student data structure

**Key Properties**:
- All timestamps use Unix milliseconds for consistency
- Profile picture URLs support external image hosting
- Address field supports free-form text for flexibility
- No embedded ID field (Firebase keys serve as unique identifiers)

### types/Guardian.ts  
**Purpose**: Guardian entity interface with complex student relationship management
**Exports**:
- `Guardian`: Guardian data structure with student relationships

**Relationship Structure**:
```typescript
students: {
  [studentId: string]: {
    reference: true;            // Always true to indicate reference relationship
    isPrimaryGuardian: boolean; // Designates primary guardian for each student
  }
}
```

**Dependencies**:
- Uses Firebase Realtime Database pattern for relationship management
- Supports one-to-many guardian-student relationships
- Primary guardian designation for emergency contact prioritization

### types/Driver.ts
**Purpose**: Driver entity interface for bus driver profile management
**Exports**:
- `Driver`: Driver profile data structure

**Key Features**:
- Government ID for legal verification requirements
- Hire date tracking for employment history
- Date of birth for age verification and insurance purposes
- Optional profile picture with null handling

### types/Route.ts
**Purpose**: Complex route management with embedded stop data and GPS tracking
**Exports**:
- `Route`: Main route entity interface
- `Location`: GPS coordinate interface
- `EmbeddedStop`: Individual stop within a route
- `StudentStatus`: Student pickup/dropoff tracking

**Complex Data Structures**:
```typescript
// GPS coordinates
interface Location {
  lat: number;  // Latitude
  lon: number;  // Longitude  
}

// Individual stop with student assignments
interface EmbeddedStop {
  expectedTime: number | null;    // Expected arrival time
  actualTime: number | null;      // Actual arrival time
  isTemplate: boolean;            // Template vs instance
  location: Location;             // GPS coordinates
  students: {                     // Student assignments at this stop
    [studentId: string]: StudentStatus;
  };
}

// Student status at specific stops
interface StudentStatus {
  reference: boolean;             // Always true (reference relationship)
  droppedOrPicked: boolean;      // Whether pickup/dropoff completed
  guardianVerified: boolean;     // Whether guardian confirmed the action
}
```

## Data Models

### Entity Relationship Overview
**Purpose**: Defines how entities relate to each other in the multi-tenant system
**Structure**:
```typescript
// High-level relationships
{
  Students: {
    // Referenced by: Guardians (many-to-many)
    // Referenced by: Routes/Stops (many-to-many)
    // No direct references to other entities
  },
  Guardians: {
    // References: Students (one-to-many with primary designation)
    // No other direct references
  },
  Drivers: {
    // Referenced by: Routes (one-to-many assignment)
    // No direct references to other entities
  },
  Routes: {
    // References: Drivers (many-to-one assignment)
    // Embeds: Stops with Student references
  }
}
```

**Validation Rules**:
- All required fields must be present and properly typed
- Timestamps must be positive Unix milliseconds
- Reference relationships must use proper Firebase key format
- GPS coordinates must be valid latitude/longitude values
- URLs must be valid HTTP/HTTPS URLs or null

### Multi-tenant Considerations
**Purpose**: All entities are designed to work within tenant-isolated databases
**Fields**:
- No tenant field in entity data (isolation through database URLs)
- All relationships are scoped within tenant boundaries
- No cross-tenant references allowed or supported
- Timestamps are UTC to avoid timezone complications across tenants

## API/Methods Documentation

### Type Usage Patterns

#### Frontend Import Pattern
**Purpose**: How to import and use types in React components
**Example**:
```typescript
import type { Student, Guardian } from '../../types/models/Student';
// Note: Frontend uses models subdirectory

const component: FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  // Component implementation
};
```

#### Backend Import Pattern  
**Purpose**: How to import and use types in Cloud Functions
**Example**:
```typescript
import type { Student, Guardian } from '../../../common/types';
// Note: Backend imports from common workspace

export const createStudent = async (
  studentData: Omit<Student, 'createdAt'>
): Promise<CRUDResponse> => {
  // Function implementation
};
```

#### Type Validation Pattern
**Purpose**: Runtime validation of data against TypeScript interfaces
**Example**:
```typescript
// Type guard functions for runtime validation
function isValidStudent(data: any): data is Student {
  return (
    typeof data.name === 'string' &&
    typeof data.dob === 'number' &&
    typeof data.address === 'string' &&
    typeof data.pictureUrl === 'string' &&
    typeof data.createdAt === 'number'
  );
}
```

## Common Patterns

### Firebase Key Pattern
**Use Case**: All entities use Firebase-generated keys as unique identifiers
**Implementation**:
```typescript
// Entity data excludes ID field
interface Student {
  // No id field - Firebase key serves as identifier
  name: string;
  // ... other fields
}

// Frontend/Backend usage includes ID
type StudentWithId = Student & { id: string };
```

### Timestamp Pattern
**Use Case**: Consistent timestamp handling across all entities
**Implementation**:
```typescript
// All timestamps are Unix milliseconds
const now = Date.now(); // Returns Unix timestamp in milliseconds
const studentData: Omit<Student, 'createdAt'> = {
  name: "John Doe",
  // ... other fields  
  // createdAt is added by backend automatically
};
```

### Optional Reference Pattern
**Use Case**: Handle optional relationships and nullable references
**Implementation**:
```typescript
// Optional references use null instead of undefined
interface Driver {
  pictureUrl: string | null;  // Explicit null for missing pictures
}

// Template vs Instance pattern
interface Route {
  driverId: string | null;           // null for templates
  currentLocationId: string | null;  // null for inactive routes
  startTime: number | null;          // null for templates
}
```

## Configuration

### TypeScript Configuration
**Structure**: Inherits from parent project TypeScript configuration
**Compilation**:
- Target: ES2017 for Node.js compatibility
- Module: NodeNext for modern module resolution
- Strict mode enabled for type safety
- Source maps generated for debugging

### Build Process
- No build step required (pure TypeScript interfaces)
- Compiled as part of parent project builds
- Type checking occurs during parent compilation
- No runtime dependencies or generated code

## Error Handling

### Type Safety Errors
- **Missing Required Fields**: TypeScript compilation errors for incomplete objects
- **Invalid Field Types**: Compile-time type checking prevents runtime errors
- **Reference Integrity**: Interface design prevents invalid relationship structures

### Runtime Validation
```typescript
// Example validation function
function validateStudentData(data: unknown): Student | null {
  if (!data || typeof data !== 'object') return null;
  
  const obj = data as any;
  if (
    typeof obj.name !== 'string' ||
    typeof obj.dob !== 'number' ||
    typeof obj.address !== 'string' ||
    typeof obj.pictureUrl !== 'string' ||
    typeof obj.createdAt !== 'number'
  ) {
    return null;
  }
  
  return obj as Student;
}
```

## Testing

### Type Testing Strategy
- **Compilation Tests**: Ensure all interfaces compile correctly
- **Usage Tests**: Verify interfaces work correctly in both frontend and backend
- **Validation Tests**: Test runtime validation functions
- **Relationship Tests**: Verify complex relationship structures work as expected

### Test Coverage Areas
- All exported interfaces compile without errors
- Frontend can import and use all types correctly
- Backend can import and use all types correctly
- Runtime validation functions work correctly
- Complex nested types (Route with embedded stops) function properly

## Performance Considerations

### Memory Usage
- Pure interfaces have zero runtime memory footprint
- Type checking occurs only at compile time
- No performance impact on running applications
- Efficient TypeScript compilation due to simple structures

### Bundle Size Impact
- No impact on frontend bundle size (types are removed at build time)
- No impact on backend function size (types are removed at build time)
- Minimal impact on development build times
- Efficient type checking due to simple interface structures

## Security Considerations

### Data Validation
- Types provide compile-time safety but not runtime validation
- Runtime validation must be implemented separately in consuming applications
- No sensitive data embedded in type definitions
- All interfaces designed for safe serialization/deserialization

### Multi-tenant Security
- No tenant information embedded in entity types
- Tenant isolation handled at application level, not type level
- No cross-tenant reference capabilities in type design
- All relationships scoped to single tenant by design

## Integration Points

### Frontend Integration
- **React Components**: Import types for component props and state
- **Redux Store**: Use types for state management and action payloads
- **API Calls**: Type request/response data for HTTP operations
- **Form Validation**: Use types for client-side input validation

### Backend Integration
- **Cloud Functions**: Type parameters and return values for all functions
- **Database Operations**: Type data being read from and written to Firebase
- **API Endpoints**: Type request bodies and response objects
- **Business Logic**: Type intermediate data structures and processing results

## Usage Examples

### Basic Entity Usage
```typescript
// Creating a new student
const newStudent: Omit<Student, 'createdAt'> = {
  name: "Jane Smith",
  dob: new Date('2010-05-15').getTime(),
  address: "123 Main St, Anytown, USA",
  pictureUrl: "https://example.com/photos/jane.jpg"
};

// Backend adds createdAt automatically
const savedStudent: Student = {
  ...newStudent,
  createdAt: Date.now()
};
```

### Complex Relationship Usage
```typescript
// Creating a guardian with student relationships
const guardian: Omit<Guardian, 'createdAt'> = {
  name: "John Smith",
  govId: "123-45-6789",
  pictureUrl: null,
  students: {
    "student_id_1": {
      reference: true,
      isPrimaryGuardian: true
    },
    "student_id_2": {
      reference: true, 
      isPrimaryGuardian: false
    }
  }
};
```

### Route with Embedded Stops
```typescript
// Creating a route template
const routeTemplate: Omit<Route, 'createdAt'> = {
  startTime: null,           // Template - no specific time
  finishTime: null,          // Template - no specific time
  isTemplate: true,
  isPickUp: true,
  startLocation: { lat: 40.7128, lon: -74.0060 },
  endLocation: { lat: 40.7589, lon: -73.9851 },
  driverId: null,           // No driver assigned to template
  currentLocationId: null,   // Template has no current location
  stops: [
    {
      expectedTime: null,    // Template stop
      actualTime: null,
      isTemplate: true,
      location: { lat: 40.7282, lon: -74.0776 },
      students: {
        "student_id_1": {
          reference: true,
          droppedOrPicked: false,
          guardianVerified: false
        }
      }
    }
  ]
};
```

## Best Practices

### Interface Design
- Keep interfaces focused and cohesive
- Use explicit null for optional references instead of undefined
- Include comprehensive JSDoc documentation
- Design for both template and instance usage patterns

### Relationship Management
- Use consistent reference patterns across all entities
- Always include reference: true for relationship objects
- Support both primary and secondary relationship designations
- Design relationships to prevent orphaned references

### Naming Conventions
- Use PascalCase for interface names
- Use camelCase for property names
- Use descriptive names that clearly indicate purpose
- Prefix boolean properties with "is" where appropriate

## Future Improvements

### Planned Enhancements
- [ ] Add runtime validation decorators for automatic type checking
- [ ] Implement schema migration utilities for version management
- [ ] Add JSON Schema generation for API documentation
- [ ] Create type-safe database query builders

### Potential Extensions
- Add audit trail interfaces for tracking changes
- Create specialized types for API request/response objects
- Add validation constraint interfaces for business rules
- Implement type-safe event interfaces for real-time updates

## References

### Related Documentation
- [Firebase Realtime Database Documentation](https://firebase.google.com/docs/database)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Integration](https://reactjs.org/docs/static-type-checking.html)

### Related Components
- [React App Documentation](../react-app/CLAUDE.md)
- [Cloud Functions Documentation](../functions/CLAUDE.md)

---

**Last Updated**: 2025-01-09
**Maintainers**: CMAD Development Team

**Note**: This documentation is part of the component-level CLAUDE.md network. Keep it synchronized with any changes to the shared type definitions or entity relationship models.