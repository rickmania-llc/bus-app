# Firebase Functions API Module

## Directory Purpose
RESTful API endpoints for the bus tracking system, organized by entity type. Each subdirectory contains a complete CRUD implementation for its respective entity (students, guardians, drivers, routes) with multi-tenant support and consistent error handling patterns.

## Architecture Notes
- Entity-based organization with separate modules for each resource type
- Consistent CRUD pattern across all entities
- Multi-tenant support via tenant header in requests
- Firebase Admin SDK for database operations
- Separation of routing logic (index.ts) from business logic (crudLogic.ts)
- Reference integrity maintenance for related entities

## Files Overview

### `index.ts`
**Purpose:** Central aggregator for all API modules
**Key Exports:**
- `studentIndex` - Student API module
- `guardianIndex` - Guardian API module
- `driverIndex` - Driver API module
- `routeIndex` - Route API module

## Entity API Structure

Each entity directory follows the same pattern:

### `{entity}/index.ts`
**Purpose:** HTTP request handler and routing for entity operations
**Common Functions:**
- CORS header configuration
- Firebase Admin initialization check
- Tenant header validation and database URL construction
- HTTP method routing (POST, PUT, DELETE, OPTIONS)
- Response formatting and error handling

**Request Flow:**
1. Set CORS headers for cross-origin access
2. Validate tenant header
3. Get tenant-specific database reference
4. Route to appropriate CRUD function
5. Format and return response

### `{entity}/crudLogic.ts`
**Purpose:** Business logic for entity operations
**Common Functions:**
- `create{Entity}` - Creates new entity with validation
- `update{Entity}` - Updates existing entity
- `delete{Entity}` - Removes entity and handles references

### `{entity}/README.md`
**Purpose:** API documentation for entity endpoints
**Common Sections:**
- Endpoint descriptions
- Request/response formats
- Validation rules
- Example requests

## Entity-Specific Features

### Students API (`students/`)
**Special Features:**
- Flexible date input (timestamps or MM/DD/YYYY format)
- Unique name validation
- Guardian reference cleanup on deletion
- Picture URL validation
- Custom ID generation: `STU{random}{timestamp}`
- Automatic createdAt timestamp on creation
- Protection against createdAt modification in updates

### Guardians API (`guardians/`)
**Special Features:**
- Student association management
- Primary guardian designation
- Bidirectional reference updates
- Multiple students per guardian
- Automatic createdAt timestamp on creation
- Protection against createdAt modification in updates

### Drivers API (`drivers/`)
**Special Features:**
- Government ID validation
- Hire date tracking
- Route assignment checks on deletion
- Driver availability management
- Automatic createdAt timestamp on creation
- Protection against createdAt modification in updates

### Routes API (`routes/`)
**Special Features:**
- Template vs instance management
- Embedded stop handling
- Student assignment to stops
- Real-time location tracking references
- Complex nested data structures
- Automatic createdAt timestamp on creation
- Protection against createdAt modification in updates

## Key Dependencies
- `firebase-functions/v2/https` - HTTP trigger functions
- `firebase-admin` - Admin SDK for database access
- Common types from `../../../../common/types/`

## Common Workflows
1. **Entity Creation:**
   - Validate required fields
   - Check uniqueness constraints
   - Generate unique ID
   - Create database record
   - Return success with ID

2. **Entity Update:**
   - Validate entity exists
   - Check field constraints
   - Apply partial updates
   - Maintain referential integrity
   - Return success confirmation

3. **Entity Deletion:**
   - Validate entity exists
   - Check for dependent records
   - Remove entity
   - Clean up references in related entities
   - Return success confirmation

## Multi-Tenant Architecture
- Tenant identified by request header
- Database URL pattern: `https://bus-app-2025-{tenant}.firebaseio.com`
- Complete data isolation between tenants
- Tenant validation on every request

## Error Handling Patterns
- **400 Bad Request:** Missing fields, validation errors, constraint violations
- **404 Not Found:** Entity doesn't exist
- **405 Method Not Allowed:** Unsupported HTTP method
- **500 Internal Server Error:** Unexpected failures

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error message"
}
```

**Success Response Format:**
```json
{
  "success": true,
  "message": "Operation details"
}
```

## Performance Considerations
- Database queries use specific paths to minimize data transfer
- Validation performed before database operations
- Batch operations for reference updates
- Efficient ID generation without database queries

## Security Notes
- Tenant isolation for multi-tenancy
- Input validation on all endpoints
- Government ID field handling for drivers
- Picture URL validation to prevent XSS
- No direct SQL injection risk (NoSQL database)

## Testing Approach
- Unit tests for validation functions
- Integration tests with Firebase emulator
- Mock tenant headers for multi-tenant testing
- Test referential integrity maintenance

## Future Enhancements
- Add pagination for list operations
- Implement bulk operations
- Add field-level permissions
- Enhance validation rules
- Add audit logging
- Implement soft deletes