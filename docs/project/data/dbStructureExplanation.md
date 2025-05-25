# Bus Tracking System Database Structure

This document explains the database structure used in the bus tracking system, as exemplified in `dbExample.json`.

## Overview

The database is organized into six main entity types:
- **drivers**: Bus drivers and their information
- **students**: Students who ride the bus
- **guardians**: Parents/guardians responsible for students
- **stops**: Bus stop locations and pickup/dropoff events
- **routes**: Bus routes (both templates and actual instances)
- **routeLocations**: GPS tracking data for active routes

## Entity Definitions

### Drivers
Contains information about bus drivers.

**Fields:**
- `id`: Unique identifier for the driver
- `name`: Driver's full name
- `dob`: Date of birth (Unix timestamp in milliseconds)
- `hireDate`: When the driver was hired (Unix timestamp in milliseconds)
- `pictureUrl`: URL to driver's profile picture

### Students
Contains information about students who use the bus service.

**Fields:**
- `id`: Unique identifier for the student
- `name`: Student's full name
- `dob`: Date of birth (Unix timestamp in milliseconds)
- `address`: Student's home address
- `pictureUrl`: URL to student's profile picture

### Guardians
Contains information about parents/guardians and their relationship to students.

**Fields:**
- `id`: Unique identifier for the guardian
- `name`: Guardian's full name
- `pictureUrl`: URL to guardian's profile picture
- `students`: Object containing references to students this guardian is responsible for
  - Each student reference includes:
    - `reference`: Always true (indicates this is a reference relationship)
    - `isPrimaryGuardian`: Boolean indicating if this is the primary guardian for the student

### Stops
Contains information about bus stops and pickup/dropoff events. Stops can be either:
1. **Template stops**: Generic stop configurations used in route templates
2. **Instance stops**: Specific stops for actual route runs on particular days

**Fields:**
- `id`: Unique identifier for the stop
- `expectedTime`: When the bus was expected to arrive (Unix timestamp in milliseconds)
- `actualTime`: When the bus actually arrived (Unix timestamp in milliseconds)
- `isTemplate`: Boolean indicating if this is a template stop or an actual instance
- `location`: GPS coordinates
  - `lat`: Latitude
  - `lon`: Longitude
- `students`: Object containing students assigned to this stop
  - Each student reference includes:
    - `reference`: Always true (indicates this is a reference relationship)
    - `droppedOrPicked`: Boolean indicating if the student was successfully picked up/dropped off
    - `guardianVerified`: Boolean indicating if a guardian verified the pickup/dropoff

### Routes
Contains information about bus routes. Routes can be either:
1. **Route templates**: Reusable route configurations for recurring routes
2. **Route instances**: Specific route runs for particular days/times

**Fields:**
- `id`: Unique identifier for the route
- `startTime`: When the route started/should start (Unix timestamp in milliseconds, null for templates)
- `finishTime`: When the route finished/should finish (Unix timestamp in milliseconds, null for templates)
- `isTemplate`: Boolean indicating if this is a template or an actual instance
- `isPickUp`: Boolean indicating if this is a pickup route (true) or dropoff route (false)
- `startLocation`: GPS coordinates where the route begins
  - `lat`: Latitude
  - `lon`: Longitude
- `endLocation`: GPS coordinates where the route ends
  - `lat`: Latitude
  - `lon`: Longitude
- `stops`: Object containing stops on this route
  - Each stop reference includes:
    - `reference`: Always true (indicates this is a reference relationship)
    - `order`: Integer indicating the order of this stop in the route
- `driverId`: Reference to the driver assigned to this route (null for templates)
- `currentLocationId`: Reference to the current location data for active routes (null for templates and completed routes)

### Route Locations
Contains GPS tracking data for active routes. This is used for real-time bus tracking.

**Fields:**
- `id`: Unique identifier for this location data point
- `location`: Current GPS coordinates
  - `lat`: Latitude
  - `lon`: Longitude
- `time`: When this location was recorded (Unix timestamp in milliseconds)
- `routeId`: Reference to the route this location data belongs to
- `isActive`: Boolean indicating if this is the current/most recent location for the route
- `speed`: Current speed in mph
- `direction`: Direction of travel in degrees (0-360, where 0/360 is north)
- `speedLimit`: Posted speed limit at this location in mph

## Key Concepts

### Templates vs Instances
The system supports both templates and actual instances:

- **Templates**: Reusable configurations that define standard routes and stops. These have `isTemplate: true` and are used to create actual route instances.
- **Instances**: Specific route runs for particular days/times. These have `isTemplate: false` and contain actual timing and tracking data.

### Reference Relationships
Relationships between entities are represented using reference objects with a `reference: true` field. This pattern allows for additional metadata about the relationship (like `order` in route stops or `isPrimaryGuardian` in guardian-student relationships).

### Timestamps
All times are stored as Unix timestamps in milliseconds. This provides precise timing for route scheduling and tracking.

### GPS Coordinates
All locations use decimal degree format for latitude and longitude coordinates.

## Data Relationships

1. **Routes → Drivers**: Each route instance is assigned to a specific driver
2. **Routes → Stops**: Routes contain multiple stops in a specific order
3. **Routes → Route Locations**: Active routes have GPS tracking data
4. **Stops → Students**: Stops track which students are picked up/dropped off
5. **Guardians → Students**: Guardians are responsible for one or more students
6. **Students → Stops**: Students are assigned to specific stops for pickup/dropoff 