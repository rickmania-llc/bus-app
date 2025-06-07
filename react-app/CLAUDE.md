# React App Module

## Directory Purpose
Administrator dashboard application built with React, Redux Toolkit, and Tailwind CSS v4. Provides the user interface for bus route management, student tracking, and system administration. Can run both as a web application and within an Electron desktop wrapper.

## Architecture Notes
- React 19 with TypeScript for type safety
- Redux Toolkit for state management with slices for each entity type
- Tailwind CSS v4 for styling with PostCSS
- Vite as build tool for fast development and optimized production builds
- Component-based architecture with containers and presentational components
- Support for both web and Electron environments

## Files Overview

### `main.tsx`
**Purpose:** Application entry point that bootstraps the React app
**Key Functions:**
- Sets up React StrictMode for development warnings
- Wraps app with Redux Provider for state management
- Renders root App component into DOM

### `App.tsx`
**Purpose:** Root application component
**Key Functions:**
- Renders DashboardContainer as the main application shell
- Simple wrapper component for future routing or global providers

### `index.html`
**Purpose:** HTML template for the application
**Usage Context:**
- Entry point for Vite development server
- Template for production build
- Includes root element for React mounting

### `vite.config.ts`
**Purpose:** Vite configuration for development and build
**Key Configuration:**
- React plugin for JSX transformation
- Base path configuration for web vs Electron builds
- Development server on port 5173
- Production build output to dist directory

### `package.json`
**Purpose:** Package configuration and dependencies
**Key Scripts:**
- `dev` - Start development server
- `build` - TypeScript check and production build
- `lint` - ESLint code quality checks
- `preview` - Preview production build

### `tailwind.config.js`
**Purpose:** Tailwind CSS v4 configuration
**Usage Context:**
- Defines custom theme extensions
- Configures content paths for CSS purging
- Sets up design system tokens

### `tsconfig.json` & `tsconfig.app.json`
**Purpose:** TypeScript configuration
**Key Settings:**
- Strict type checking enabled
- JSX preserve for React
- Module resolution for imports
- Path aliases configuration

## Key Dependencies
- `react` & `react-dom` - Core React framework
- `@reduxjs/toolkit` & `react-redux` - State management
- `react-router-dom` - Client-side routing
- `lucide-react` - Icon library
- `tailwindcss` v4 - Utility-first CSS framework
- `vite` - Build tool and dev server
- `typescript` - Type safety

## Common Workflows
1. **Component Development:** Create component → Add to container → Connect to Redux if needed
2. **State Management:** Define slice → Add to store → Use hooks in components
3. **Styling:** Use Tailwind utilities → Create custom components → Maintain consistency
4. **Environment Detection:** Check isElectron() → Conditionally use electronAPI → Fallback to web APIs

## Performance Considerations
- Vite provides fast HMR (Hot Module Replacement) in development
- Production builds are optimized with tree-shaking and minification
- Redux state updates should be immutable for optimal re-renders
- Lazy loading for route-based code splitting when needed

## Security Notes
- Environment detection prevents web APIs in Electron context
- All API calls should go through proper authentication
- Sensitive data should not be stored in Redux state
- XSS prevention through React's built-in protections

## Directory Structure

### `src/components/`
Presentational components for UI elements
- `NavigationPanel.tsx` - Side navigation menu
- `MainPanel.tsx` - Main content area router
- `main-panel/` - Panel-specific components

### `src/containers/`
Smart components that connect to Redux
- `DashboardContainer.tsx` - Main application shell

### `src/redux/`
State management with Redux Toolkit
- `store.ts` - Redux store configuration
- `slices/` - Feature-specific state slices

### `src/types/`
TypeScript type definitions
- `electron.d.ts` - Electron API types

### `src/utils/`
Utility functions and helpers
- `environment.ts` - Environment detection utilities

### `public/`
Static assets served directly
- `vite.svg` - Default Vite logo

### `dist/`
Production build output (gitignored)