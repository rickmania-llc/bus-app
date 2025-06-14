# Development Startup Guide

This guide explains how to start up the entire Bus App project for local development and testing.

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager (`npm install -g yarn`)
- Firebase CLI (`npm install -g firebase-tools`)
- Git

## Project Structure Overview

- `/react-app` - React frontend application
- `/electron` - Electron desktop wrapper
- `/functions` - Firebase Cloud Functions
- `/common` - Shared types and utilities

## Step-by-Step Startup Process

### 1. Install Dependencies

First, install all project dependencies:

```bash
# Install root dependencies
yarn install

# Install React app dependencies
cd react-app
yarn install
cd ..

# Install Electron dependencies
cd electron
yarn install
cd ..

# Install Firebase Functions dependencies
cd functions
yarn install
cd ..
```

### 2. Start Firebase Emulators

The Firebase emulators provide local versions of Firebase services (Realtime Database, Functions, etc.).

```bash
# From the project root directory
firebase emulators:start
```

This will start:
- **Emulator UI**: http://localhost:4000
- **Functions**: http://localhost:5001
- **Realtime Database**: http://localhost:9000

Keep this terminal window open.

### 3. Start the React Development Server

In a new terminal window:

```bash
cd react-app
yarn dev
```

This starts the React app at http://localhost:5173

Keep this terminal window open.

### 4. Start the Electron App

In another new terminal window:

```bash
# From the project root directory
yarn electron:dev
```

This will:
1. Wait for the React dev server to be ready
2. Launch the Electron desktop app
3. Load the React app inside Electron

## Verification Steps

1. **Check Firebase Emulators**:
   - Navigate to http://localhost:4000
   - You should see the Firebase Emulator Suite UI
   - Verify that Realtime Database and Functions are running

2. **Check React App**:
   - The Electron window should open automatically
   - You should see the Bus App interface
   - Check the developer console for any errors (View → Toggle Developer Tools)

3. **Test Data Flow**:
   - Navigate to the Students section
   - You should see any test data from the emulated database
   - Try adding a new student to verify the Functions are working

## Common Issues and Solutions

### Issue: Firebase emulators won't start
- **Solution**: Make sure port 4000, 5001, and 9000 are free
- Kill any processes using these ports: `lsof -ti:4000 | xargs kill -9`

### Issue: Electron app shows blank screen
- **Solution**: Wait for React dev server to fully start before launching Electron
- Check that http://localhost:5173 is accessible in your browser

### Issue: "electronAPI is not defined" errors
- **Solution**: Make sure you're running the app through Electron, not just in a browser
- The `window.electronAPI` is only available in the Electron environment

### Issue: No data showing in the app
- **Solution**: Check the Firebase Emulator UI to ensure the database has data
- Verify the tenant is set correctly (defaults to 'dev')

## Development Workflow

1. **Making Frontend Changes**: 
   - Edit files in `/react-app/src`
   - Changes will hot-reload in the Electron app

2. **Making Electron Changes**:
   - Edit files in `/electron`
   - You'll need to restart the Electron app (Ctrl+C and `yarn electron:dev`)

3. **Making Functions Changes**:
   - Edit files in `/functions/src`
   - The emulators will auto-reload the functions

4. **Viewing Logs**:
   - React logs: In the Electron DevTools console
   - Electron main process logs: In the terminal running `yarn electron:dev`
   - Functions logs: In the terminal running Firebase emulators

## Stopping the Services

1. **Stop Electron**: Close the app window or Ctrl+C in its terminal
2. **Stop React**: Ctrl+C in the React terminal
3. **Stop Firebase Emulators**: Ctrl+C in the Firebase terminal

## Production Build Testing

To test a production build locally:

```bash
# Build the React app
cd react-app
yarn build

# Run Electron with the built files
cd ..
yarn electron:start
```

## Environment Variables

The project uses `.env` files for configuration:
- `/electron/.env` - Electron environment variables
- Check `.env.example` files for required variables

## Additional Resources

- [Firebase Emulator Suite Documentation](https://firebase.google.com/docs/emulator-suite)
- [Electron Documentation](https://www.electronjs.org/docs)
- [React + Vite Documentation](https://vitejs.dev/guide/)