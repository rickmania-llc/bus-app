# Electron Setup

This directory contains the Electron main process and preload scripts for the Bus Tracking desktop application.

## Development

To run the Electron app in development mode:

1. Start the React dev server:
   ```bash
   cd react-app
   yarn dev
   ```

2. In another terminal, start Electron:
   ```bash
   yarn electron:dev
   ```

## Production Build

To build the desktop app:

1. Build the React app:
   ```bash
   cd react-app
   yarn build
   ```

2. Build the Electron app:
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