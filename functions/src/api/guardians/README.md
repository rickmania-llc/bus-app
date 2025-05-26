# Guardian API Endpoints

This document provides a quick reference for the Guardian CRUD API endpoints implemented in Firebase Functions.

**Base URL (Local Emulator):**

`http://localhost:5001/bus-app-2025/us-central1/guardianCrud`

**Headers:**

All requests should include the `Content-Type: application/json` header.

## Guardian Data Structure

The Guardian object has the following structure:
- `name` (string, required): Guardian's full name
- `govId` (string, required): Guardian's government ID number (must be unique)
- `pictureUrl` (string or null, optional): URL to guardian's profile picture
- `students` (array or null, optional): Array of student references

### Students Array Format

When providing students, use this format:
```json
[
  {
    "id": "STU12345...",
    "isPrimaryGuardian": true
  },
  {
    "id": "STU67890...",
    "isPrimaryGuardian": false
  }
]
```

**Students Array Behavior:**
- `null` or `undefined`: No students assigned
- `[]` (empty array): Clears all student assignments
- Array with objects: Replaces current student assignments

## 1. Create Guardian (POST)

Creates a new guardian record in the Firebase Realtime Database.

*   **Endpoint:** `/` (appended to the base URL)
*   **Method:** `POST`
*   **Payload (Request Body):** `application/json`

    ```json
    {
        "name": "string",
        "govId": "string",
        "pictureUrl": "string" | null,
        "students": [
            {
                "id": "string",
                "isPrimaryGuardian": boolean
            }
        ] | null
    }
    ```

*   **Required Fields:** `name`, `govId`
*   **Optional Fields:** `pictureUrl` (if not provided, will be saved as `null`), `students` (if not provided, will be saved as empty object)

**Example using curl (with students):**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "govId": "123456789",
    "pictureUrl": "https://example.com/john.jpg",
    "students": [
      {
        "id": "STU12345abcdef",
        "isPrimaryGuardian": true
      },
      {
        "id": "STU67890ghijkl",
        "isPrimaryGuardian": false
      }
    ]
  }' \
  http://localhost:5001/bus-app-2025/us-central1/guardianCrud
```

**Example without pictureUrl:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "govId": "987654321"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/guardianCrud
```

**Example with null pictureUrl:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Johnson",
    "govId": "555666777",
    "pictureUrl": null,
    "students": null
  }' \
  http://localhost:5001/bus-app-2025/us-central1/guardianCrud
```

## 2. Update Guardian (PUT)

Updates an existing guardian record based on the provided guardian ID.

*   **Endpoint:** `/:guardianId` (appended to the base URL)
*   **Method:** `PUT`
*   **URL Parameter:** `guardianId` - The unique ID of the guardian to update (e.g., `GUA...`)
*   **Payload (Request Body):** `application/json`

    ```json
    {
        "name"?: "string",
        "govId"?: "string",
        "pictureUrl"?: "string" | null,
        "students"?: [
            {
                "id": "string",
                "isPrimaryGuardian": boolean
            }
        ] | null
    }
    ```

*   **Updateable Fields:** Any of the fields (`name`, `govId`, `pictureUrl`, `students`) can be included in the payload to update that specific field. At least one updateable field must be provided.

**Students Update Behavior:**
- If `students` is **undefined**: No change to existing student assignments
- If `students` is **null**: No change (keeps existing assignments)
- If `students` is **[]** (empty array): Clears all student assignments
- If `students` is **array with objects**: Replaces all current assignments with new ones

**Example using curl (updating name and students):**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith Jr.",
    "students": [
      {
        "id": "STU12345abcdef",
        "isPrimaryGuardian": true
      }
    ]
  }' \
  http://localhost:5001/bus-app-2025/us-central1/guardianCrud/GUA9c3vt1970c5ee15a
```

**Example clearing all students:**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "students": []
  }' \
  http://localhost:5001/bus-app-2025/us-central1/guardianCrud/GUA9c3vt1970c5ee15a
```

**Example updating only govId:**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "govId": "111222333"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/guardianCrud/GUA9c3vt1970c5ee15a
```

## 3. Delete Guardian (DELETE)

Deletes a guardian record based on the provided guardian ID.

*   **Endpoint:** `/:guardianId` (appended to the base URL)
*   **Method:** `DELETE`
*   **URL Parameter:** `guardianId` - The unique ID of the guardian to delete (e.g., `GUA...`)
*   **Payload (Request Body):** None required.

**Example using curl:**

```bash
curl -X DELETE http://localhost:5001/bus-app-2025/us-central1/guardianCrud/GUAhk0hi1970c5f744a
```

## Validation Rules

### Required Field Validation
- `name`: Cannot be empty or null
- `govId`: Cannot be empty or null, must be unique across all guardians

### Optional Field Validation
- `pictureUrl`: Can be null, empty string, or a valid HTTP/HTTPS URL. Only validated for URL format when provided.

### Students Array Validation
- Each student object must have `id` (string) and `isPrimaryGuardian` (boolean)
- Student IDs must reference existing students in the database
- Students array can be null, empty array, or array of valid student objects

### URL Validation
- `pictureUrl` must match pattern: `^https?:\/\/.+` (only when provided)

## Error Responses

The API returns appropriate HTTP status codes:
- `200`: Success (for updates and deletes)
- `201`: Created (for successful creation)
- `400`: Bad Request (validation errors, missing fields, etc.)
- `500`: Internal Server Error

Error response format:
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Success response format:
```json
{
  "success": true,
  "message": "Operation completed successfully"
}
```

## Integration with Student Management

When a student is deleted from the system, they are automatically removed from all guardians that reference them. This ensures data consistency across the application. 