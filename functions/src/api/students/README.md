# Student API Endpoints

This document provides a quick reference for the Student CRUD API endpoints implemented in Firebase Functions.

**Base URL (Local Emulator):**

`http://localhost:5001/bus-app-2025/us-central1/studentCrud`

**Headers:**

All requests MUST include:
- `Content-Type: application/json`
- `Tenant: <tenant-name>` - Required for multi-tenancy support

The `Tenant` header determines which Firebase database instance to use. The database URL format is `https://bus-app-2025-<tenant-name>.firebaseio.com`.

## Date Format Support

The `dob` (date of birth) field accepts two formats:
1. **Unix timestamp** (number): Milliseconds since January 1, 1970 UTC
2. **Date string** (string): MM/DD/YYYY format (e.g., "01/26/1981", "2/5/1990")

Both single-digit and double-digit months/days are supported in the string format.

## 1. Create Student (POST)

Creates a new student record in the Firebase Realtime Database.

*   **Endpoint:** `/` (appended to the base URL)
*   **Method:** `POST`
*   **Payload (Request Body):** `application/json`

    ```json
    {
        "name": "string",
        "dob": number | "string", // Unix timestamp in milliseconds OR MM/DD/YYYY format
        "address": "string",
        "pictureUrl": "string" | null // Optional
    }
    ```

*   **Required Fields:** `name`, `dob`, `address`
*   **Optional Fields:** `pictureUrl` (if not provided, will be saved as `null`)

**Example using curl (with timestamp):**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Tenant: demo" \
  -d '{
    "name": "John Doe",
    "dob": 1609459200000,
    "address": "123 Main St, Anytown, USA",
    "pictureUrl": "https://example.com/john.jpg"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/studentCrud
```

**Example using curl (with date string):**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Tenant: demo" \
  -d '{
    "name": "Jane Smith",
    "dob": "01/26/1981",
    "address": "456 Oak Ave, Newtown, USA"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/studentCrud
```

**Example with single-digit month/day:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Tenant: demo" \
  -d '{
    "name": "Bob Johnson",
    "dob": "2/5/1990",
    "address": "789 Elm St, Somewhere, USA"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/studentCrud
```

## 2. Update Student (PUT)

Updates an existing student record based on the provided student ID.

*   **Endpoint:** `/:studentId` (appended to the base URL)
*   **Method:** `PUT`
*   **URL Parameter:** `studentId` - The unique ID of the student to update (e.g., `STU...`)
*   **Payload (Request Body):** `application/json`

    ```json
    {
        "name"?: "string",
        "dob"?: number | "string", // Unix timestamp in milliseconds OR MM/DD/YYYY format
        "address"?: "string",
        "pictureUrl"?: "string" | null
    }
    ```

*   **Updateable Fields:** Any of the fields (`name`, `dob`, `address`, `pictureUrl`) can be included in the payload to update that specific field. At least one updateable field must be provided.

**Example using curl (updating with date string):**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Tenant: demo" \
  -d '{
    "dob": "12/25/1985",
    "address": "789 Pine St, Oldtown, USA"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/studentCrud/STU9c3vt1970c5ee15a
```

**Example using curl (updating with timestamp):**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Tenant: demo" \
  -d '{
    "dob": 1577836800000,
    "pictureUrl": null
  }' \
  http://localhost:5001/bus-app-2025/us-central1/studentCrud/STU9c3vt1970c5ee15a
```

## 3. Delete Student (DELETE)

Deletes a student record based on the provided student ID.

*   **Endpoint:** `/:studentId` (appended to the base URL)
*   **Method:** `DELETE`
*   **URL Parameter:** `studentId` - The unique ID of the student to delete (e.g., `STU...`)
*   **Payload (Request Body):** None required.

**Example using curl:**

```bash
curl -X DELETE \
  -H "Tenant: demo" \
  http://localhost:5001/bus-app-2025/us-central1/studentCrud/STUhk0hi1970c5f744a
``` 