# Route API Endpoints

This document provides a quick reference for the Route CRUD API endpoints implemented in Firebase Functions.

**Base URL (Local Emulator):**

`http://localhost:5001/bus-app-2025/us-central1/routeCrud`

**Headers:**

All requests should include the `Content-Type: application/json` header.

## Data Structure Overview

Routes have embedded stop information with nested student status tracking. Key concepts:

- **Templates vs Instances**: Routes can be templates (`isTemplate: true`) for reuse, or specific instances (`isTemplate: false`) for actual route runs
- **Embedded Stops**: The `stops` array contains complete stop information including student status
- **Location Coordinates**: All locations use decimal degrees format (lat: -90 to 90, lon: -180 to 180)
- **Timestamps**: All time fields use Unix timestamps in milliseconds

## 1. Create Route (POST)

Creates a new route record in the Firebase Realtime Database.

*   **Endpoint:** `/` (appended to the base URL)
*   **Method:** `POST`
*   **Payload (Request Body):** `application/json`

    ```json
    {
        "isTemplate": boolean, // Required
        "isPickUp": boolean,   // Required
        "startTime": number | null,     // Unix timestamp, null for templates
        "finishTime": number | null,    // Unix timestamp, null for templates
        "startLocation": {              // Optional
            "lat": number,
            "lon": number
        },
        "endLocation": {                // Optional
            "lat": number,
            "lon": number
        },
        "stops": [                      // Optional array
            {
                "expectedTime": number | null,
                "actualTime": number | null,
                "isTemplate": boolean,
                "location": {
                    "lat": number,
                    "lon": number
                },
                "students": {
                    "student_uuid": {
                        "reference": boolean,
                        "droppedOrPicked": boolean,
                        "guardianVerified": boolean
                    }
                }
            }
        ],
        "driverId": "string" | null,       // Optional driver reference
        "currentLocationId": "string" | null // Optional location reference
    }
    ```

*   **Required Fields:** `isTemplate`, `isPickUp`
*   **Optional Fields:** All other fields

**Example - Create Route Template:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "isTemplate": true,
    "isPickUp": true,
    "startLocation": {"lat": 34.0000, "lon": -118.0000},
    "endLocation": {"lat": 34.1000, "lon": -118.3000},
    "stops": [
        {
            "expectedTime": null,
            "actualTime": null,
            "isTemplate": true,
            "location": {"lat": 34.0522, "lon": -118.2437},
            "students": {
                "student_uuid_1": {
                    "reference": true,
                    "droppedOrPicked": false,
                    "guardianVerified": false
                }
            }
        }
    ]
  }' \
  http://localhost:5001/bus-app-2025/us-central1/routeCrud
```

**Example - Create Route Instance:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "isTemplate": false,
    "isPickUp": true,
    "startTime": 1716557400000,
    "finishTime": 1716561000000,
    "startLocation": {"lat": 34.0000, "lon": -118.0000},
    "endLocation": {"lat": 34.1000, "lon": -118.3000},
    "driverId": "DRI12345abc",
    "stops": [
        {
            "expectedTime": 1716559200000,
            "actualTime": null,
            "isTemplate": false,
            "location": {"lat": 34.0522, "lon": -118.2437},
            "students": {
                "STUabc123": {
                    "reference": true,
                    "droppedOrPicked": false,
                    "guardianVerified": false
                }
            }
        }
    ]
  }' \
  http://localhost:5001/bus-app-2025/us-central1/routeCrud
```

## 2. Update Route (PUT)

Updates an existing route record based on the provided route ID.

*   **Endpoint:** `/:routeId` (appended to the base URL)
*   **Method:** `PUT`
*   **URL Parameter:** `routeId` - The unique ID of the route to update (e.g., `ROU...`)
*   **Payload (Request Body):** `application/json`

    ```json
    {
        "isTemplate"?: boolean,
        "isPickUp"?: boolean,
        "startTime"?: number | null,
        "finishTime"?: number | null,
        "startLocation"?: {
            "lat": number,
            "lon": number
        },
        "endLocation"?: {
            "lat": number,
            "lon": number
        },
        "stops"?: [...],              // Complete stops array replacement
        "driverId"?: "string" | null,
        "currentLocationId"?: "string" | null
    }
    ```

*   **Important:** When updating `stops`, the entire array is replaced. To update individual stops, provide the complete stops array with modifications.

**Example - Update Route Times:**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": 1716558000000,
    "finishTime": 1716562000000
  }' \
  http://localhost:5001/bus-app-2025/us-central1/routeCrud/ROU9c3vt1970c5ee15a
```

**Example - Update Stop Status:**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "stops": [
        {
            "expectedTime": 1716559200000,
            "actualTime": 1716559260000,
            "isTemplate": false,
            "location": {"lat": 34.0522, "lon": -118.2437},
            "students": {
                "STUabc123": {
                    "reference": true,
                    "droppedOrPicked": true,
                    "guardianVerified": true
                }
            }
        }
    ]
  }' \
  http://localhost:5001/bus-app-2025/us-central1/routeCrud/ROU9c3vt1970c5ee15a
```

**Example - Assign Driver:**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": "DRI67890def"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/routeCrud/ROU9c3vt1970c5ee15a
```

**Example - Clear All Stops:**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "stops": []
  }' \
  http://localhost:5001/bus-app-2025/us-central1/routeCrud/ROU9c3vt1970c5ee15a
```

## 3. Delete Route (DELETE)

Deletes a route record based on the provided route ID.

*   **Endpoint:** `/:routeId` (appended to the base URL)
*   **Method:** `DELETE`
*   **URL Parameter:** `routeId` - The unique ID of the route to delete (e.g., `ROU...`)
*   **Payload (Request Body):** None required.

**Example using curl:**

```bash
curl -X DELETE http://localhost:5001/bus-app-2025/us-central1/routeCrud/ROUhk0hi1970c5f744a
```

## Validation Rules

### Required Fields
- `isTemplate` and `isPickUp` are always required for creation
- At least one field must be provided for updates

### Coordinate Validation
- `lat` must be between -90 and 90
- `lon` must be between -180 and 180

### Timestamp Validation
- Must be positive numbers (milliseconds since Unix epoch)
- Cannot be more than 1 year in the future
- `finishTime` must be after `startTime` when both are provided

### Reference Validation
- Referenced `driverId` must exist in the drivers collection
- Referenced student IDs in stops must exist in the students collection

### Stop Structure
- Each stop must have a `location` object with valid coordinates
- Each stop must have a `students` object (can be empty)
- Student status objects must have `reference`, `droppedOrPicked`, and `guardianVerified` boolean fields

## Response Format

**Success Response (200):**
```json
{
    "success": true,
    "message": "Route ROU9c3vt1970c5ee15a created successfully"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "error": "Missing required field: isTemplate"
}
```

**Server Error (500):**
```json
{
    "success": false,
    "error": "Internal server error"
}
``` 