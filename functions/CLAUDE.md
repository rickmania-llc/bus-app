# Firebase Cloud Functions - Backend API Services

## Directory Purpose
The Firebase Cloud Functions serve as the backend API layer for the bus transportation tracking system, providing secure, scalable CRUD operations and business logic. This service handles multi-tenant data isolation, implements REST API endpoints for all entities (students, guardians, drivers, routes), and ensures data consistency through Firebase Realtime Database operations with proper error handling and validation.

## Architecture Notes

### Design Patterns
- **CRUD Handler Pattern**: Consistent API structure across all entity types
- **Multi-tenant Architecture**: Database isolation through tenant-specific URLs
- **Factory Pattern**: Reusable CRUD logic with entity-specific implementations
- **Middleware Pattern**: CORS and tenant validation for all requests

### Technology Stack
- **Runtime**: Node.js 22 with TypeScript compilation
- **Framework**: Firebase Cloud Functions v2 HTTP triggers
- **Database**: Firebase Admin SDK with Realtime Database
- **Language**: TypeScript with strict mode compilation
- **Build System**: TypeScript compiler with ES2017 target
- **Deployment**: Firebase CLI with Google Cloud integration

### Key Integration Points
- **Firebase Realtime Database**: Multi-tenant database operations through Admin SDK
- **React Frontend**: HTTP REST API endpoints for CRUD operations
- **Firebase Authentication**: Future integration for user session validation
- **Common Types**: Shared TypeScript interfaces with frontend application

## Documentation Network

This directory contains Firebase Cloud Functions backend documentation organized by API domains:

### Core Documentation
- **[src/api/CLAUDE.md](src/api/CLAUDE.md)**: API endpoint structure and routing logic
- **[src/api/students/CLAUDE.md](src/api/students/CLAUDE.md)**: Student management API operations
- **[src/api/guardians/CLAUDE.md](src/api/guardians/CLAUDE.md)**: Guardian management with relationship handling
- **[src/api/drivers/CLAUDE.md](src/api/drivers/CLAUDE.md)**: Driver profile and assignment management
- **[src/api/routes/CLAUDE.md](src/api/routes/CLAUDE.md)**: Route and stop management operations

### Quick Navigation Guide
1. **New to the backend?** Start with this file, then explore [src/api/CLAUDE.md](src/api/CLAUDE.md)
2. **Working on API endpoints?** See specific entity documentation in [src/api/*/CLAUDE.md](src/api/)
3. **Adding new entities?** Follow patterns in existing [src/api/students/CLAUDE.md](src/api/students/CLAUDE.md)
4. **Debugging database operations?** Check entity-specific crudLogic.ts files

## Files Overview

### Entry Points

#### src/index.ts
**Purpose**: Main Firebase Functions export file defining HTTP triggers
**Key Functions**:
- `helloWorld`: Basic health check endpoint
- `studentCrud`: Student management HTTP trigger
- `guardianCrud`: Guardian management HTTP trigger  
- `driverCrud`: Driver management HTTP trigger
- `routeCrud`: Route management HTTP trigger
**Usage**: Exports all Cloud Functions for Firebase deployment

### Core API Structure (`src/api/`)

#### src/api/index.ts
**Purpose**: Central export hub for all API modules
**Exports**:
- `studentIndex`: Student API operations
- `guardianIndex`: Guardian API operations
- `driverIndex`: Driver API operations
- `routeIndex`: Route API operations
**Features**: Consistent export pattern for all entity APIs

#### src/api/students/
**Core Files**:
- `index.ts`: Main CRUD handler with HTTP method routing
- `crudLogic.ts`: Business logic for student operations

**API Features**:
- **POST /studentCrud**: Create new student records
- **PUT /studentCrud/{id}**: Update existing student data
- **DELETE /studentCrud/{id}**: Remove student and update guardian relationships
- **OPTIONS**: CORS preflight handling

### Data Layer

#### Firebase Admin Integration
**Database Configuration**:
- Multi-tenant URL pattern: `https://bus-app-2025-{tenant}.firebaseio.com`
- Tenant isolation through request header validation
- Admin SDK initialization with project credentials

**Database References**:
- `students/`: Student profile data
- `guardians/`: Guardian data with student relationship references
- `drivers/`: Driver profile and assignment data
- `routes/`: Route data with embedded stop information

#### Entity Operations Pattern
Each entity follows consistent CRUD patterns:

```typescript
interface CRUDResponse {
  success: boolean;
  message: string;
  data?: any;
}
```

**Create Operations**:
- Generate timestamps automatically
- Validate required fields
- Handle relationship creation
- Return success confirmation

**Update Operations**:
- Partial update support
- Relationship integrity maintenance
- Validation before database writes
- Atomic transaction support

**Delete Operations**:
- Cascade delete for relationships
- Data integrity preservation
- Cleanup of orphaned references
- Confirmation responses

### Communication Layer

#### CORS Configuration
**Headers Applied to All Responses**:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: Content-Type,Tenant`
- `Access-Control-Allow-Methods: POST,PUT,DELETE`
- `Content-Type: application/json`

#### Tenant Validation
**Required Headers**:
- `Tenant`: Specifies which tenant database to access
- Validation occurs before all operations
- 400 error returned if tenant header missing

#### Error Response Format
```typescript
{
  message: string;  // Human-readable error description
  code?: string;    // Optional error code for client handling
}
```

### Utilities and Helpers

#### Database Connection Management
- Firebase Admin SDK initialization check
- Dynamic database URL construction based on tenant
- Connection pooling and error handling
- Reference creation for specific entity collections

#### Error Handling Utilities
- Consistent error response formatting
- Logging integration for debugging
- HTTP status code standardization
- Client-friendly error messages

## Key Dependencies

### Core Firebase
- **firebase-admin**: Server-side Firebase SDK for database and authentication
- **firebase-functions**: Cloud Functions framework and HTTP triggers
- **firebase-functions-test**: Testing utilities for local development

### Development Tools
- **typescript**: Static type checking and compilation
- **eslint**: Code quality and consistency enforcement
- **@typescript-eslint/parser**: TypeScript-specific ESLint rules
- **eslint-config-google**: Google's ESLint configuration standards

### Build and Development
- **Node.js 22**: Runtime environment requirement
- **TypeScript 4.9**: Compilation to ES2017 target
- **Source Maps**: Debugging support in production

## Common Workflows

### Student Creation Workflow
1. **Request Validation**: Check tenant header and request format
2. **Data Validation**: Validate required student fields (name, dob, address)
3. **Database Operation**: Create student record with generated timestamp
4. **Response**: Return success confirmation with 201 status
5. **Real-time Update**: Firebase triggers frontend listeners automatically

### Guardian-Student Relationship Management
1. **Guardian Creation**: Create guardian record with student references
2. **Relationship Setup**: Configure primary guardian designation
3. **Bidirectional Links**: Update student records with guardian references
4. **Validation**: Ensure relationship integrity and constraints
5. **Cleanup**: Handle orphaned relationships on deletion

### Multi-tenant Data Isolation
1. **Tenant Header Extraction**: Get tenant from request headers
2. **Database URL Construction**: Build tenant-specific Firebase URL
3. **Admin SDK Connection**: Connect to tenant database instance
4. **Operation Execution**: Perform CRUD operations within tenant scope
5. **Response**: Return results with tenant context preserved

## Testing Approach

### Test Structure
- **Local Emulator Testing**: Firebase emulator suite for development
- **Unit Tests**: Individual function testing (firebase-functions-test)
- **Integration Tests**: End-to-end API testing with emulator
- **Multi-tenant Testing**: Tenant isolation validation

### Test Configuration
- Firebase emulator configuration in root firebase.json
- Test data import/export for consistent testing
- Automated testing in CI/CD pipeline (to be implemented)

### Testing Commands
```bash
# Start emulators for testing
npm run serve

# Run shell for function testing  
npm run shell

# Build and test locally
npm run build && firebase emulators:start --only functions
```

## Performance/Security Considerations

### Performance
- **Function Cold Start Optimization**: Minimize initialization time
- **Database Connection Pooling**: Reuse Admin SDK connections
- **Efficient Queries**: Optimized database read/write operations
- **Response Caching**: Future implementation for read-heavy operations

### Security
- **Tenant Isolation**: Complete data separation between tenants
- **Input Validation**: Comprehensive request validation before processing
- **Firebase Security Rules**: Database-level access control (to be configured)
- **Authentication Integration**: Future JWT validation middleware

### Scalability
- **Serverless Architecture**: Automatic scaling with Cloud Functions
- **Database Partitioning**: Multi-tenant isolation enables horizontal scaling
- **Stateless Operations**: No server-side session dependencies
- **Connection Management**: Efficient Firebase Admin SDK usage

## Configuration

### Environment Variables
- **FIREBASE_CONFIG**: Automatically provided by Firebase runtime
- **GOOGLE_CLOUD_PROJECT**: Project identification for Admin SDK
- **NODE_ENV**: Environment detection (development/production)

### TypeScript Configuration
```typescript
{
  compilerOptions: {
    module: "NodeNext",
    moduleResolution: "nodenext",
    strict: true,
    target: "es2017",
    outDir: "lib"
  },
  include: ["src", "../common"]
}
```

### Firebase Function Configuration
- Node.js 22 runtime requirement
- Main entry point: `lib/functions/src/index.js`
- Build command: `tsc` for TypeScript compilation
- Deploy command: `firebase deploy --only functions`

## Deployment Considerations

### Production Requirements
- Firebase project with Functions enabled
- Appropriate IAM permissions for database access
- Multi-tenant database setup completed
- Monitoring and logging configuration

### Monitoring
- **Cloud Functions Logs**: Comprehensive logging for debugging
- **Performance Monitoring**: Execution time and memory usage tracking
- **Error Tracking**: Automatic error reporting and alerting
- **Database Usage**: Monitor read/write operations and costs

### Maintenance
- **Dependency Updates**: Regular security patches and version updates
- **Function Optimization**: Performance monitoring and improvements
- **Database Maintenance**: Index optimization and cleanup operations
- **Backup Strategy**: Regular database backups and disaster recovery

## API Documentation

### Public Endpoints

#### Student Management
- **POST /studentCrud**:
  - **Request**: `{ name: string, dob: number, address: string, pictureUrl: string }`
  - **Response**: `{ message: "Student created successfully" }`
  - **Authorization**: Tenant header required

- **PUT /studentCrud/{id}**:
  - **Request**: Partial student data updates
  - **Response**: `{ message: "Student updated successfully" }`
  - **Authorization**: Tenant header required

- **DELETE /studentCrud/{id}**:
  - **Request**: Student ID in URL path
  - **Response**: `{ message: "Student deleted successfully" }`
  - **Authorization**: Tenant header required

#### Guardian Management
- **POST /guardianCrud**:
  - **Request**: `{ name: string, govId: string, pictureUrl: string?, students: {} }`
  - **Response**: `{ message: "Guardian created successfully" }`
  - **Authorization**: Tenant header required

#### Driver Management  
- **POST /driverCrud**:
  - **Request**: `{ name: string, govId: string, dob: number, hireDate: number, pictureUrl: string? }`
  - **Response**: `{ message: "Driver created successfully" }`
  - **Authorization**: Tenant header required

#### Route Management
- **POST /routeCrud**:
  - **Request**: Complete route object with embedded stops
  - **Response**: `{ message: "Route created successfully" }`
  - **Authorization**: Tenant header required

### Error Responses
- **400 Bad Request**: Missing tenant header or invalid request data
- **404 Not Found**: Requested entity does not exist
- **500 Internal Server Error**: Database or system errors

## Error Handling

### Error Types
- **Tenant Validation Errors**: Missing or invalid tenant header
- **Data Validation Errors**: Required fields missing or invalid format
- **Database Errors**: Connection failures or constraint violations
- **System Errors**: Firebase Admin SDK or Cloud Functions runtime errors

### Error Recovery
- **Automatic Retry**: Built-in Cloud Functions retry logic
- **Graceful Degradation**: Partial success handling where possible
- **Client Feedback**: Clear error messages for frontend handling
- **Logging**: Comprehensive error logging for debugging

## Best Practices

### Code Organization
- **Consistent Structure**: All entities follow same CRUD pattern
- **Separation of Concerns**: Business logic separate from HTTP handling
- **TypeScript Usage**: Strict typing throughout all code
- **Error Handling**: Comprehensive try-catch blocks with proper logging

### Data Handling
- **Atomic Operations**: Database operations maintain consistency
- **Input Validation**: Validate all inputs before processing
- **Timestamp Management**: Automatic timestamp generation and updates
- **Relationship Integrity**: Maintain referential integrity across entities

### API Design
- **REST Principles**: Standard HTTP methods and status codes
- **Consistent Responses**: Uniform response format across all endpoints
- **CORS Support**: Proper cross-origin resource sharing configuration
- **Tenant Isolation**: Complete multi-tenant data separation

## Known Issues

### Current Limitations
- **Authentication Missing**: No user authentication validation implemented
- **Limited Error Details**: Some error messages could be more specific
- **No Rate Limiting**: Potential for abuse without request throttling
- **Basic Logging**: Enhanced logging and monitoring needed

### Workarounds
- **Manual Tenant Management**: Use hardcoded tenant values for development
- **Error Debugging**: Use Firebase emulator for local testing
- **Security**: Rely on Firebase security rules for access control
- **Monitoring**: Use Firebase console for basic function monitoring

## Common Commands

### Development
```bash
npm run build                # Compile TypeScript to JavaScript
npm run build:watch         # Watch mode compilation
npm run serve               # Start local emulator
npm run shell              # Functions shell for testing
```

### Testing  
```bash
npm run lint               # ESLint code quality check
firebase emulators:start --only functions  # Test functions locally
firebase functions:log     # View production logs
```

### Deployment
```bash
npm run deploy            # Deploy to Firebase
firebase deploy --only functions  # Deploy functions only
firebase functions:config:get     # View environment config
```

---

**Note**: This documentation is part of the comprehensive CLAUDE.md network. Always keep it updated when making changes to the Cloud Functions architecture, adding new endpoints, or modifying the multi-tenant data model.