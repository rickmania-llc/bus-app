# Driver API Endpoints

This document provides a quick reference for the Driver CRUD API endpoints implemented in Firebase Functions.

**Base URL (Local Emulator):**

`http://localhost:5001/bus-app-2025/us-central1/driverCrud`

**Headers:**

All requests should include the `Content-Type: application/json` header.

## Driver Data Structure

The Driver object has the following structure:
- `name` (string, required): Driver's full name
- `govId` (string, required): Driver's government ID number (must be unique)
- `dob` (number/string, required): Date of birth (Unix timestamp or MM/DD/YYYY format)
- `hireDate` (number/string, required): Hire date (Unix timestamp or MM/DD/YYYY format)
- `pictureUrl` (string or null, optional): URL to driver's profile picture

### Date Format Support

Both `dob` and `hireDate` accept:
- **Unix timestamp** (number): Milliseconds since epoch (e.g., `631152000000` for 01/01/1990)
- **MM/DD/YYYY string**: Date string format (e.g., `"01/26/1981"` or `"2/5/1990"`)

## 1. Create Driver (POST)

Creates a new driver record in the Firebase Realtime Database.

*   **Endpoint:** `/` (appended to the base URL)
*   **Method:** `POST`
*   **Payload (Request Body):** `application/json`

    ```json
    {
        "name": "string",
        "govId": "string",
        "dob": number | "MM/DD/YYYY",
        "hireDate": number | "MM/DD/YYYY",
        "pictureUrl": "string" | null
    }
    ```

*   **Required Fields:** `name`, `govId`, `dob`, `hireDate`
*   **Optional Fields:** `pictureUrl` (if not provided, will be saved as `null`)

**Example using curl (with timestamp dates):**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "govId": "DL123456789",
    "dob": 347155200000,
    "hireDate": 1609459200000,
    "pictureUrl": "https://example.com/john.jpg"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/driverCrud
```

**Example using curl (with string dates):**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "govId": "DL987654321",
    "dob": "03/15/1985",
    "hireDate": "01/01/2021"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/driverCrud
```

**Example without pictureUrl:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Johnson",
    "govId": "DL555666777",
    "dob": "12/25/1980",
    "hireDate": "06/15/2020"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/driverCrud
```

## 2. Update Driver (PUT)

Updates an existing driver record based on the provided driver ID.

*   **Endpoint:** `/:driverId` (appended to the base URL)
*   **Method:** `PUT`
*   **URL Parameter:** `driverId` - The unique ID of the driver to update (e.g., `DRI...`)
*   **Payload (Request Body):** `application/json`

    ```json
    {
        "name"?: "string",
        "govId"?: "string",
        "dob"?: number | "MM/DD/YYYY",
        "hireDate"?: number | "MM/DD/YYYY",
        "pictureUrl"?: "string" | null
    }
    ```

*   **Updateable Fields:** Any of the fields (`name`, `govId`, `dob`, `hireDate`, `pictureUrl`) can be included in the payload to update that specific field. At least one updateable field must be provided.

**PictureUrl Update Behavior:**
- If `pictureUrl` is **undefined**: No change to existing picture URL
- If `pictureUrl` is **null** or **empty string**: Sets picture URL to null
- If `pictureUrl` is **valid URL string**: Updates to new URL

**Example using curl (updating name and hire date):**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith Jr.",
    "hireDate": "01/15/2022"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/driverCrud/DRI9c3vt1970c5ee15a
```

**Example updating govId:**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "govId": "DL111222333"
  }' \
  http://localhost:5001/bus-app-2025/us-central1/driverCrud/DRI9c3vt1970c5ee15a
```

**Example setting pictureUrl to null:**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "pictureUrl": null
  }' \
  http://localhost:5001/bus-app-2025/us-central1/driverCrud/DRI9c3vt1970c5ee15a
```

## 3. Delete Driver (DELETE)

Deletes a driver record based on the provided driver ID.

*   **Endpoint:** `/:driverId` (appended to the base URL)
*   **Method:** `DELETE`
*   **URL Parameter:** `driverId` - The unique ID of the driver to delete (e.g., `DRI...`)
*   **Payload (Request Body):** None required.

**Integration:** When a driver is deleted, all routes that reference this driver will have their `driverId` field set to `null` automatically.

**Example using curl:**

```bash
curl -X DELETE http://localhost:5001/bus-app-2025/us-central1/driverCrud/DRIhk0hi1970c5f744a
```

## Validation Rules

### Required Field Validation
- `name`: Cannot be empty or null
- `govId`: Cannot be empty or null, must be unique across all drivers
- `dob`: Must be a valid date (timestamp or MM/DD/YYYY format)
- `hireDate`: Must be a valid date (timestamp or MM/DD/YYYY format)

### Optional Field Validation
- `pictureUrl`: Can be null, empty string, or a valid HTTP/HTTPS URL. Only validated for URL format when provided.

### Date Validation
- **Timestamp validation**: Must be positive number
- **String format validation**: Must match MM/DD/YYYY pattern with single or double-digit months/days
- **Date existence validation**: Invalid dates like February 30th are rejected
- **Year range validation**: Must be between 1900 and current year
- **Month/day range validation**: Month 1-12, day 1-31

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

## Integration with Route Management

When a driver is deleted from the system, they are automatically removed from all routes that reference them (by setting the route's `driverId` to `null`). This ensures data consistency across the application.

## ID Generation

Driver IDs are automatically generated using the format: `DRI<5RandomChars><HexTimestamp>`

Example: `DRIabc12370f5a2b8c` 