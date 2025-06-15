# Utils Module

## Directory Purpose
Utility functions and services for the React admin dashboard. Contains Firebase integration services and other helper functions used throughout the application.

## Architecture Notes
- Service-oriented architecture for external integrations
- Modular organization by functionality
- TypeScript for type safety
- Environment-aware configuration

## Subdirectories

### `firebase/`
Firebase integration module for real-time database synchronization
- **Purpose:** Direct Firebase Web SDK integration replacing Electron IPC
- **Key Files:**
  - `authHandler.ts` - Firebase app initialization and configuration
  - `databaseHandler.ts` - Real-time listener management
  - `types.ts` - Firebase-specific TypeScript types
  - `CLAUDE.md` - Detailed Firebase module documentation
- **Usage:** Initialized once in DashboardContainer, manages all data flow

## Common Workflows
1. **Firebase Setup:** DashboardContainer initializes → DatabaseHandler sets up listeners → Redux receives updates
2. **Adding New Utilities:** Create file → Export functions → Import where needed

## Performance Considerations
- Firebase listeners are singleton instances
- Proper cleanup prevents memory leaks
- Environment-based configuration for dev/prod

## Security Notes
- Firebase credentials managed through environment variables
- No sensitive data stored in utility functions
- Multi-tenant isolation through Firebase configuration