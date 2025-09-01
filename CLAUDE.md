# Bus Transportation Tracking Application - Project Overview

## AI Development Strategy

This project follows a comprehensive AI-driven software engineering strategy using Claude Code and AI tools. All development should adhere to the principles and processes outlined in this document.

## Development Rules & Standards

### Package Management
- **MANDATORY**: Yarn Package Manager
- Install packages: `yarn add [package]`
- Install dev dependencies: `yarn add -D [package]`
- Install dependencies: `yarn install`
- Run scripts: `yarn [script-name]`
- Install workspaces: `yarn workspaces run install`

### Code Standards
- TypeScript strict mode enabled across all modules
- React 19+ with modern hooks and functional components
- Redux Toolkit for state management with proper typing
- Firebase Realtime Database with multi-tenant architecture
- Firebase Cloud Functions for backend API operations
- Electron for desktop application wrapper
- Component-based architecture with clear separation of concerns
- Error boundaries and proper error handling throughout
- Consistent commit message format: `type(scope): description`
- Prettier/ESLint for code formatting and quality

### Git & Version Control Integration
- Branch naming convention: `feature/issue-number-description`
- Commit messages should be descriptive and follow conventional commits
- Pull requests require comprehensive description and testing
- Main branch: `main`
- Development branch: `cmad-new` (currently active)

## AI Development Workflow

### Issue Management Process
1. **Planning**: Break down large features into manageable components
2. **Issue Creation**: Create detailed issues with acceptance criteria
3. **Implementation**: Execute issues following established patterns
4. **Review**: Comprehensive review and integration process

### Documentation Requirements
- **CRITICAL**: Every issue MUST update relevant `CLAUDE.md` files
- All new functions, files, and architectural changes must be documented
- Documentation updates are mandatory for issue completion
- API endpoints must be documented with request/response examples
- Data model changes require schema documentation updates

## Project Architecture

### System Overview
The Bus Transportation Tracking Application is a comprehensive multi-tenant system designed to manage bus routes, students, guardians, and drivers for educational transportation services. It provides real-time tracking, student management, guardian communication, and route optimization capabilities through a modern web-based interface with desktop application support.

### Service Architecture
```
┌─────────────────┐     ┌──────────────┐     ┌──────────────────┐
│   React Web     │────▶│   Firebase   │────▶│   Firebase       │
│   Application   │     │   Functions  │     │   Realtime DB    │
└─────────────────┘     └──────────────┘     └──────────────────┘
         │                       │                       │
         │                       ▼                       │
         │               ┌──────────────┐                │
         │               │   Firebase   │                │
         └──────────────▶│   Auth       │◀───────────────┘
                         └──────────────┘
         
┌─────────────────┐
│   Electron      │
│   Desktop       │────▶ (Wraps React Web App)
│   Wrapper       │
└─────────────────┘
```

### Directory Structure
```
bus-app/
├── CLAUDE.md (this file)
├── react-app/                    # Frontend React application
│   └── CLAUDE.md
├── functions/                    # Firebase Cloud Functions backend
│   └── CLAUDE.md
├── common/                       # Shared TypeScript types and utilities
│   └── CLAUDE.md
├── electron/                     # Electron desktop wrapper (to be created)
├── tests/                        # End-to-end testing suite
│   └── CLAUDE.md
├── package.json                  # Root workspace configuration
├── firebase.json                 # Firebase project configuration
└── yarn.lock                     # Package lock file
```

### Core Services/Components

#### 1. React Web Application (react-app/)
- **Technology**: React 19, TypeScript, Vite, TailwindCSS, Redux Toolkit
- **Purpose**: Main user interface for managing bus operations
- **Key Features**: Student/Guardian/Driver CRUD, Route management, Real-time tracking

#### 2. Firebase Cloud Functions (functions/)
- **Technology**: Node.js 22, TypeScript, Firebase Functions SDK
- **Purpose**: Backend API services with multi-tenant support
- **Key Features**: CRUD operations, Database triggers, Authentication middleware

#### 3. Common Types Library (common/)
- **Technology**: TypeScript interfaces and utilities
- **Purpose**: Shared data models and type definitions
- **Key Features**: Student, Guardian, Driver, Route interfaces

#### 4. Electron Desktop Wrapper
- **Technology**: Electron, Node.js
- **Purpose**: Cross-platform desktop application
- **Key Features**: Native desktop integration, Offline capabilities

### Communication Patterns
- **HTTP REST API**: Frontend communicates with Cloud Functions via REST endpoints
- **Real-time Listeners**: Firebase Realtime Database provides live data synchronization
- **Multi-tenant Architecture**: Tenant isolation through database URL routing
- **Event-driven Updates**: Redux state management with Firebase event listeners

## Implementation Guidelines for Claude Code

### Pre-Implementation Checklist
1. Read relevant directory-level `CLAUDE.md` files for context
2. Review issue requirements and acceptance criteria
3. Identify which `CLAUDE.md` files will need updates
4. Understand the multi-tenant architecture implications
5. Review existing patterns in similar components

### During Implementation
1. Follow established patterns from existing code
2. Implement all requirements systematically
3. **Update `CLAUDE.md` files** with new functions, files, and changes
4. Ensure proper TypeScript typing throughout
5. Maintain Firebase security rules compliance
6. Test multi-tenant functionality

### Post-Implementation
1. Verify all acceptance criteria are met
2. Ensure `CLAUDE.md` files are accurately updated
3. Run `yarn lint` and `yarn build:all`
4. Test Firebase emulator integration
5. Verify Electron packaging works correctly

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 22 (Functions), Browser (React)
- **Framework**: React 19, Firebase Cloud Functions
- **Database**: Firebase Realtime Database (multi-tenant)
- **Authentication**: Firebase Authentication
- **Desktop**: Electron 36+
- **State Management**: Redux Toolkit with React-Redux

### Key Dependencies
- **firebase**: Firebase SDK for client-side operations
- **firebase-admin**: Firebase Admin SDK for server-side operations
- **firebase-functions**: Cloud Functions framework
- **react**: UI library with hooks and functional components
- **@reduxjs/toolkit**: Modern Redux with type safety
- **axios**: HTTP client for API communications
- **electron**: Desktop application framework
- **vite**: Fast build tool and dev server
- **tailwindcss**: Utility-first CSS framework

## Database Schema

### Core Entities
- **Students**: Student profiles with personal information and transportation needs
- **Guardians**: Parent/guardian accounts with multi-student relationships
- **Drivers**: Driver profiles with licensing and employment information
- **Routes**: Bus routes with embedded stops and student assignments

### Multi-Tenant Structure
```
Firebase Realtime Database URLs:
- https://bus-app-2025-dev.firebaseio.com/
- https://bus-app-2025-prod.firebaseio.com/
- https://bus-app-2025-{tenant}.firebaseio.com/

Each tenant database contains:
├── students/
│   └── {studentId}/              # Student data
├── guardians/
│   └── {guardianId}/             # Guardian data with student references
├── drivers/
│   └── {driverId}/               # Driver data
└── routes/
    └── {routeId}/                # Route data with embedded stops
```

### Relationships
- Guardian-to-Student: One-to-many with primary guardian designation
- Driver-to-Route: One-to-many assignment relationship
- Route-to-Student: Many-to-many through embedded stop assignments
- Location-to-Route: Embedded GPS coordinates in route and stop data

## Security Architecture

### Authentication
- Firebase Authentication for user identity
- Multi-tenant isolation through database routing
- Role-based access control (future enhancement)

### Security Features
- Tenant header validation for all API requests
- Firebase security rules for database access control
- CORS configuration for allowed origins
- Input validation and sanitization

### Known Security Considerations
- Database rules currently restrictive (read/write false)
- Need to implement proper authentication-based rules
- API endpoints require tenant header validation
- No current rate limiting implemented

## Integration Points

### External Services
- **Firebase Services**: Authentication, Realtime Database, Cloud Functions, Hosting
- **Google Maps API**: Location services and route optimization (future enhancement)

### Internal APIs
- **Student CRUD**: `/studentCrud` - Create, read, update, delete student records
- **Guardian CRUD**: `/guardianCrud` - Guardian management operations
- **Driver CRUD**: `/driverCrud` - Driver profile management
- **Route CRUD**: `/routeCrud` - Route and stop management

## Development Environment Setup

### Required Tools
- Node.js 22.x or higher
- Yarn package manager (latest)
- Firebase CLI tools
- Electron development tools

### Environment Configuration
1. **Install Dependencies**:
   ```bash
   yarn install
   yarn workspaces run build
   ```

2. **Firebase Setup**:
   ```bash
   firebase login
   firebase use bus-app-2025
   ```

3. **Start Development Environment**:
   ```bash
   # Terminal 1: Start Firebase emulators
   yarn emulators
   
   # Terminal 2: Start React development server
   cd react-app && yarn dev
   
   # Terminal 3: Start Electron (when ready)
   yarn electron:dev
   ```

## Deployment

### Production Requirements
- Firebase project with appropriate quotas
- Multi-tenant database configuration
- Environment variable configuration
- SSL certificates for custom domains

### Deployment Process
1. **Build All Components**:
   ```bash
   yarn clean:all
   yarn build:all
   ```

2. **Deploy Firebase Functions**:
   ```bash
   cd functions && yarn deploy
   ```

3. **Deploy React Application**:
   ```bash
   firebase deploy --only hosting
   ```

4. **Package Electron Application**:
   ```bash
   yarn electron:build
   ```

## Quality Standards

### Code Quality
- TypeScript strict mode compliance
- ESLint and Prettier formatting
- Component-based architecture
- Proper error handling and logging
- Performance optimization for real-time updates

### Documentation Quality
- Keep `CLAUDE.md` files current with all changes
- Document all public APIs with examples
- Include usage patterns and best practices
- Explain multi-tenant architecture implications
- Update schema documentation when models change

### Testing Requirements
- End-to-end testing with Playwright
- Firebase emulator testing
- Component unit testing (to be implemented)
- Multi-tenant data isolation testing

## Performance Considerations

### Optimization Areas
- Firebase listener management for real-time updates
- Redux state normalization for large datasets
- Electron memory management
- Bundle size optimization with Vite

### Monitoring
- Firebase performance monitoring
- Error tracking and logging
- Real-time database usage metrics
- Desktop application crash reporting

## Maintenance & Evolution

### Regular Updates
- Update `CLAUDE.md` files when architecture changes
- Monitor Firebase usage quotas and costs
- Review and update security rules
- Update dependencies and security patches

### Process Improvement
- Regular retrospectives on AI development workflow
- Update templates based on project experience
- Refine multi-tenant architecture patterns
- Document lessons learned and best practices

## Known Issues and Limitations

### Current Limitations
1. Database security rules are overly restrictive (read/write: false)
2. No authentication flow implemented yet
3. Electron main process file missing
4. Limited error handling in some API endpoints

### Technical Debt
1. Need to implement proper authentication and authorization
2. Add comprehensive error boundaries in React components
3. Implement offline capabilities for Electron app
4. Add proper logging and monitoring infrastructure

## Getting Help

### Resources
- Review service-specific CLAUDE.md files for detailed documentation
- Firebase documentation for platform-specific guidance
- React and Redux Toolkit documentation for frontend patterns

### Common Commands
```bash
# Development
yarn install                    # Install all dependencies
yarn dev                       # Start React development server
yarn emulators                 # Start Firebase emulators
yarn electron:dev              # Start Electron in development

# Testing
yarn test:e2e                  # Run end-to-end tests
yarn test:e2e:ui               # Run tests with UI
yarn test:e2e:debug            # Debug test runs

# Building
yarn build:all                 # Build all workspaces
yarn electron:build           # Package Electron app
yarn clean:all                 # Clean all build artifacts

# Firebase Operations
firebase emulators:start       # Start emulators manually
firebase deploy --only functions  # Deploy functions only
firebase deploy --only hosting   # Deploy frontend only
```

---

**Remember**: This documentation-driven approach ensures consistent, scalable development with AI assistance. Every change to the codebase should be reflected in the appropriate documentation to maintain the effectiveness of our AI development strategy. The multi-tenant architecture requires special attention to tenant isolation and security considerations in all implementations.