# Tests Module

## Directory Purpose
End-to-end testing suite for the Electron desktop application using Playwright. Provides automated testing infrastructure to ensure the desktop app functions correctly with proper IPC communication between Electron main process and React renderer.

## Architecture Notes
- Uses Playwright for Electron testing
- Custom test fixtures for Electron app lifecycle management
- Tests both UI rendering and IPC (Inter-Process Communication) functionality
- Runs in isolated test environment with NODE_ENV=test

## Files Overview

### `e2e/electron-test-utils.ts`
**Purpose:** Test utilities and fixtures for Playwright Electron testing
**Key Functions:**
- `test` - Extended Playwright test with Electron-specific fixtures
- `electronApp` fixture - Launches and manages Electron app lifecycle for tests
- `page` fixture - Provides access to the first Electron window for testing
**Key Configuration:**
- Launches Electron with main.js entry point
- Adds --no-sandbox flag for CI environments
- Sets NODE_ENV to 'test' for test-specific behavior

### `e2e/app.spec.ts`
**Purpose:** Main test specifications for the Electron application
**Test Cases:**
- `should launch and display main window` - Verifies app launches with correct title and root element
- `should have IPC communication available` - Checks electronAPI is exposed to renderer
- `should handle IPC calls` - Tests IPC communication (placeholder for actual implementation)

## Key Dependencies
- `playwright` - Core testing framework
- `@playwright/test` - Test runner and assertions
- Electron app at `/electron/main.js`

## Common Workflows
1. **Test Execution:** `yarn test:e2e` → Playwright launches Electron → Runs test suite → Closes app
2. **Adding Tests:** Import test utilities → Write test cases → Use page and electronApp fixtures
3. **IPC Testing:** Access window.electronAPI → Call IPC methods → Assert responses

## Testing Approach
- Integration tests focus on Electron-specific features
- Tests verify both UI rendering and IPC functionality
- Placeholder tests indicate areas needing implementation
- Tests run in isolated environment to avoid conflicts

## Performance Considerations
- Tests launch full Electron app (slower than unit tests)
- Each test gets fresh app instance for isolation
- --no-sandbox flag improves CI performance

## Security Notes
- Tests run with --no-sandbox flag (only safe in test environments)
- Test environment variables isolated from production
- No real API calls or database connections in tests