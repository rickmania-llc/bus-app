# Student API Endpoints

This document provides a quick reference for the Student CRUD API endpoints implemented in Firebase Functions.

**Base URL (Local Emulator):**

`http://localhost:5001/bus-app-2025/us-central1/studentCrud`

**Headers:**

All requests should include the `Content-Type: application/json` header.

## 1. Create Student (POST)

Creates a new student record in the Firebase Realtime Database.

*   **Endpoint:** `/` (appended to the base URL)
*   **Method:** `POST`
*   **Payload (Request Body):** `application/json`

    ```json
    {
        "name": "string",
        "dob": number, // Unix timestamp in milliseconds
        "address": "string",
        "pictureUrl": "string" | null // Optional
    }
    ```

*   **Required Fields:** `name`, `dob`, `address`
*   **Optional Fields:** `pictureUrl` (if not provided, will be saved as `null`)

**Example using curl:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "dob": 1609459200000, \
    "address": "123 Main St, Anytown, USA", \
    "pictureUrl": "https://example.com/john.jpg"\
  }' \
  http://localhost:5001/bus-app-2025/us-central1/studentCrud
```

**Example without optional pictureUrl:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "dob": 1577836800000, \
    "address": "456 Oak Ave, Newtown, USA"\
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
        "dob"?: number, // Unix timestamp in milliseconds
        "address"?: "string",
        "pictureUrl"?: "string" | null
    }
    ```

*   **Updateable Fields:** Any of the fields (`name`, `dob`, `address`, `pictureUrl`) can be included in the payload to update that specific field. At least one updateable field must be provided.

**Example using curl:**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "address": "789 Pine St, Oldtown, USA", \
    "pictureUrl": null\
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
curl -X DELETE http://localhost:5001/bus-app-2025/us-central1/studentCrud/STUhk0hi1970c5f744a
``` 