# Electron Setup

This directory contains the Electron main process and preload scripts for the Bus Tracking desktop application.

## Environment Configuration

Before running the application, you need to set up environment variables:

1. Copy the appropriate template file to `.env`:
   - For development: `cp .env.development .env`
   - For production: `cp .env.production .env`

2. For production, update `.env` with:
   - `FIREBASE_SERVICE_ACCOUNT_PATH` - Path to your Firebase service account JSON file
   - Other Firebase configuration values as needed

**Note:** The `.env` file is gitignored and should never be committed to version control.

## Development

To run the Electron app in development mode:

1. Ensure you have created `.env` from `.env.development`

2. Start the React dev server:
   ```bash
   cd react-app
   yarn dev
   ```

3. In another terminal, start Electron:
   ```bash
   yarn electron:dev
   ```

## Production Build

To build the desktop app:

1. Ensure you have created `.env` from `.env.production` and updated it with your production configuration

2. Build the React app:
   ```bash
   cd react-app
   yarn build
   ```

3. Build the Electron app:
   ```bash
   yarn electron:build
   ```

## Architecture

- `main.js` - Main process entry point, handles window creation and IPC
- `preload.js` - Preload script that exposes secure IPC methods to renderer
- The React app runs in the renderer process with access to `window.electronAPI`

## Security

- Context isolation is enabled
- Node integration is disabled in renderer
- All IPC channels are explicitly whitelisted in preload.js