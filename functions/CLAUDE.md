# Firebase Functions Module

## Directory Purpose
Backend API services implemented as Firebase Cloud Functions. Provides RESTful endpoints for CRUD operations on all entities (students, guardians, drivers, routes) with multi-tenant support via tenant-specific Firebase Realtime Database instances.

## Architecture Notes
- Firebase Functions v2 with HTTP triggers
- Multi-tenant architecture using tenant header for database routing
- TypeScript for type safety with shared types from common module
- CORS enabled for cross-origin requests
- Firebase Admin SDK for database operations
- Modular structure with separate API modules for each entity

## Files Overview

### `src/index.ts`
**Purpose:** Main entry point that exports all Cloud Functions
**Key Functions:**
- `helloWorld` - Simple test function for deployment verification
- `studentCrud` - HTTP function handling student CRUD operations
- `guardianCrud` - HTTP function handling guardian CRUD operations
- `driverCrud` - HTTP function handling driver CRUD operations
- `routeCrud` - HTTP function handling route CRUD operations

### `src/api/index.ts`
**Purpose:** API module aggregator for clean imports
**Key Exports:**
- Re-exports all entity-specific API modules
- Provides single import point for function definitions

### `package.json`
**Purpose:** Package configuration for Firebase Functions
**Key Scripts:**
- `build` - Compile TypeScript to JavaScript
- `serve` - Run local emulator for development
- `deploy` - Deploy functions to Firebase
- `logs` - View function execution logs

### `tsconfig.json`
**Purpose:** TypeScript configuration for Functions
**Key Settings:**
- Node.js ES2017 target for Functions runtime
- Strict type checking enabled
- Includes both src and common directories
- Module resolution for Firebase imports

## API Modules Structure

### `api/students/`
**Purpose:** Student entity CRUD operations
**Files:**
- `index.ts` - Main request handler with routing and tenant resolution
- `crudLogic.ts` - Business logic for create, update, delete operations
- `README.md` - API documentation

**Key Functions in crudLogic.ts:**
- `createStudent` - Creates new student with validation, unique ID generation, and sets createdAt timestamp
- `updateStudent` - Updates existing student with partial data, prevents createdAt modification
- `deleteStudent` - Removes student and cleans up guardian references
- `parseDateOfBirth` - Utility for flexible date input handling
- `removeStudentFromGuardians` - Cleanup utility for maintaining referential integrity

### `api/guardians/`
**Purpose:** Guardian entity CRUD operations
**Structure:** Similar to students module with index.ts, crudLogic.ts, and README.md
**Key Features:** Creates guardians with createdAt timestamp, prevents createdAt updates

### `api/drivers/`
**Purpose:** Driver entity CRUD operations
**Structure:** Similar to students module with index.ts, crudLogic.ts, and README.md
**Key Features:** Creates drivers with createdAt timestamp, prevents createdAt updates

### `api/routes/`
**Purpose:** Route entity CRUD operations with embedded stops
**Structure:** Similar to students module with index.ts, crudLogic.ts, and README.md
**Key Features:** Creates routes with createdAt timestamp, prevents createdAt updates

## Key Dependencies
- `firebase-admin` - Admin SDK for database operations
- `firebase-functions` - Functions framework
- TypeScript and ESLint for development
- Shared types from `../common` directory

## Common Workflows
1. **Request Handling:** HTTP request → Extract tenant header → Route to entity handler → Validate → Execute CRUD → Return response
2. **Multi-tenant Database:** Get tenant from header → Construct database URL → Get database reference → Perform operations
3. **Entity Creation:** Generate unique ID → Validate uniqueness → Create record → Return success
4. **Entity Updates:** Validate entity exists → Check constraints → Apply partial updates → Return success
5. **Entity Deletion:** Validate entity exists → Remove record → Clean up references → Return success

## Performance Considerations
- Functions cold start optimization through modular imports
- Database operations use specific references to minimize data transfer
- Validation performed before database operations
- Batch updates for referential integrity maintenance

## Security Notes
- Tenant header required for all operations
- CORS configured for controlled access
- Input validation on all endpoints
- No direct SQL injection risk (NoSQL database)
- URL validation for picture fields
- Unique constraint enforcement

## Error Handling Patterns
- 400 Bad Request for validation errors
- 404 Not Found for missing entities
- 405 Method Not Allowed for unsupported HTTP methods
- 500 Internal Server Error for unexpected failures
- Consistent error message format across all endpoints

## Testing Approach
- Local emulator for development testing
- Firebase Functions Test SDK for unit tests
- Separate test configuration in tsconfig.dev.json
- Mock database for isolated testing