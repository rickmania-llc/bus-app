# Guardian UI Implementation Issue

## Overview
Implement a comprehensive Guardian management UI in the React application following the established pattern used for Student management. This includes creating the main guardian list view with cards, a side panel for CRUD operations, and a student assignment interface that allows selecting one or more students per guardian with primary guardian designation.

## Current State
Currently, the application has:
- Backend Guardian CRUD API implemented at `/guardianCrud` endpoint
- Guardian data model defined in common types
- Redux slice for guardian state management (guardianSlice.ts)
- DatabaseHandler with guardian listeners but missing static CRUD methods
- No frontend UI for managing guardians

**Current Code Location**: DatabaseHandler missing methods at `/react-app/src/services/DatabaseHandler.ts`
```typescript
// DatabaseHandler.ts - Student CRUD methods exist
static async createStudent(student: Omit<Student, 'id' | 'createdAt'>): Promise<void>
static async updateStudent(id: string, updates: Partial<Omit<Student, 'id' | 'createdAt'>>): Promise<void>
static async deleteStudent(id: string): Promise<void>
// <-- Guardian CRUD methods need to be added here following same pattern
```

## Requirements

### Primary Requirement
- Create a complete Guardian management interface that mirrors the Student UI architecture while adding student assignment capabilities

### Guardian UI Components
The new guardian management system should include:
1. **GuardiansMainPanel** - Main list view showing all guardians as cards
2. **GuardianCard** - Individual guardian display card showing key information and student count
3. **GuardianSidePanel** - Slide-out panel for creating/editing guardians with student assignment
4. **Student Selection Interface** - Within the side panel, ability to assign students and mark primary guardian

### DatabaseHandler Guardian CRUD Methods
- **Location**: `/react-app/src/services/DatabaseHandler.ts`
- **Functionality**: Static methods to interface with Guardian Cloud Functions API
- **Output Format**: Promise<void> with Redux state updates via existing listeners
- **Error Handling**: Try/catch with appropriate error messages to user
- **Performance**: Optimistic updates where appropriate

## Technical Implementation Plan

### Phase 1: DatabaseHandler CRUD Methods
Add static methods to DatabaseHandler for guardian operations:
- TODO: Implement `createGuardian` method following student pattern
- TODO: Implement `updateGuardian` method with partial update support
- TODO: Implement `deleteGuardian` method with confirmation
- TODO: Ensure all methods include proper tenant headers from AuthService

### Phase 2: Guardian UI Components
Create the main guardian management components:
- TODO: Create `GuardiansMainPanel.tsx` in `/components/main-panel/`
- TODO: Create `GuardianCard.tsx` in `/components/cards/`
- TODO: Create `GuardianSidePanel.tsx` in `/components/side-panels/`
- TODO: Add guardian route to main navigation system

### Phase 3: Student Assignment Interface
Implement student selection within GuardianSidePanel:
- TODO: Create student selector component with checkboxes
- TODO: Add primary guardian toggle for each assigned student
- TODO: Show current guardian assignments when editing
- TODO: Validate at least one primary guardian per student

### Phase 4: Integration and Polish
Complete integration and user experience enhancements:
- TODO: Add search/filter functionality to GuardiansMainPanel
- TODO: Implement loading states and error handling
- TODO: Add success/error toast notifications
- TODO: Update navigation to include Guardian management option

## File References

### Core Guardian Files
- `/common/types/models/Guardian.ts` - Guardian type definition
- `/react-app/src/redux/slices/guardianSlice.ts` - Redux state management
- `/functions/src/api/guardians/crudLogic.ts` - Backend CRUD logic

### Documentation References
- `/docs/project/data/dbStructureExplanation.md` - Guardian data model explanation
- `/react-app/CLAUDE.md` - Frontend architecture documentation

### Existing Pattern Files (Reference Implementation)
- `/react-app/src/components/main-panel/StudentsMainPanel.tsx` - Main panel pattern to follow
- `/react-app/src/components/side-panels/StudentSidePanel.tsx` - Side panel pattern to follow
- `/react-app/src/components/cards/StudentCard.tsx` - Card component pattern

### Guardian API Integration Points
- **Create Guardian**: POST to `/guardianCrud` with guardian data
- **Update Guardian**: PUT to `/guardianCrud` with id and updates
- **Delete Guardian**: DELETE to `/guardianCrud` with id
- **Student Assignment**: Pass students array with `{id, isPrimaryGuardian}` objects

## Implementation TODOs

### DatabaseHandler Development TODOs
- [ ] Add `createGuardian(guardian: Omit<Guardian, 'id' | 'createdAt'>): Promise<void>`
- [ ] Add `updateGuardian(id: string, updates: Partial<Omit<Guardian, 'id' | 'createdAt'>>): Promise<void>`
- [ ] Add `deleteGuardian(id: string): Promise<void>`
- [ ] Transform student assignment format from array to object structure for API
- [ ] Handle unique govId validation errors from backend
- [ ] Add proper TypeScript types for all methods
- [ ] Include tenant headers in all API calls using `AuthService.getTenantHeaders()`

### Guardian UI Component TODOs
- [ ] Create `GuardiansMainPanel.tsx` with grid layout and "Add Guardian" button
- [ ] Implement `GuardianCard.tsx` showing name, govId, picture, and student count
- [ ] Build `GuardianSidePanel.tsx` with create/edit modes
- [ ] Add form validation for required fields (name, govId)
- [ ] Implement picture URL input with preview
- [ ] Create delete confirmation modal
- [ ] Add loading states for async operations
- [ ] Implement responsive design for mobile devices

### Student Assignment Interface TODOs
- [ ] Create `StudentAssignmentList` component for guardian side panel
- [ ] Fetch all students and show checkboxes for assignment
- [ ] Add "Primary Guardian" toggle for each assigned student
- [ ] Show current assignments when editing existing guardian
- [ ] Validate at least one student must have primary guardian
- [ ] Handle case where student already has primary guardian elsewhere
- [ ] Sort students alphabetically for easy selection
- [ ] Add search/filter for student list when many students exist

### Testing and Validation TODOs
- [ ] Test creating guardian with valid data
- [ ] Test duplicate govId rejection
- [ ] Test updating guardian information
- [ ] Test student assignment and primary guardian changes
- [ ] Test deleting guardian with student assignments
- [ ] Test error handling for network failures
- [ ] Verify real-time updates across multiple browser sessions

### **MANDATORY: Documentation Update TODOs**
- [ ] **Update CLAUDE.md files**: Update all relevant directory-level `CLAUDE.md` files to reflect new functions, files, or architectural changes
- [ ] **Identify affected directories**: List all directories whose `CLAUDE.md` files require updates
- [ ] **Document new functions**: Add descriptions of any new functions with their purpose, inputs, and outputs
- [ ] **Document new files**: Add any new files to the appropriate `CLAUDE.md` with their role and key functions
- [ ] **Update architectural notes**: Modify architectural patterns or dependency information if changed
- [ ] **Verify documentation accuracy**: Ensure all `CLAUDE.md` updates accurately reflect the implemented changes

## Acceptance Criteria

### Functional Acceptance
1. **Guardian List View**: Users can view all guardians in a card grid layout
2. **Create Guardian**: Users can create new guardians with name, govId, and optional picture
3. **Edit Guardian**: Users can update guardian information and student assignments
4. **Delete Guardian**: Users can delete guardians with confirmation dialog
5. **Student Assignment**: Users can assign/unassign students and set primary guardian status

### Performance Acceptance  
1. **Page Load Time**: Guardian list loads within 2 seconds for up to 100 guardians
2. **Real-time Updates**: Changes reflect across all connected clients within 500ms
3. **Search Performance**: Filter/search operations complete within 200ms

### Quality Acceptance
1. **Responsive Design**: UI works on desktop, tablet, and mobile screen sizes
2. **Error Handling**: All errors display user-friendly messages
3. **Data Validation**: Form prevents invalid data submission
4. **Accessibility**: Components are keyboard navigable and screen reader friendly

### **MANDATORY: Documentation Acceptance**
1. **CLAUDE.md Updates Complete**: All relevant directory-level `CLAUDE.md` files have been updated with new functions, files, and architectural changes
2. **Documentation Accuracy**: Updated documentation accurately reflects implemented functionality and follows established format
3. **Completeness Check**: No new functions or files are missing from appropriate `CLAUDE.md` files
4. **Architectural Consistency**: Any architectural changes are reflected in relevant documentation

## Development Notes

### Guardian Card Pattern to Follow
Reference existing StudentCard component for:
- Card layout and styling with Tailwind CSS
- Hover effects and selected state styling
- Picture display with fallback icon
- Information hierarchy and typography

### Integration Pattern
Follow existing patterns in DatabaseHandler for:
- Static method structure and error handling
- Tenant header inclusion from AuthService
- Response format handling (guardian API uses success/error format)
- Redux listener integration for real-time updates

## CLAUDE.md Update Requirements

**This section MUST be completed as part of issue implementation:**

### Directories Requiring CLAUDE.md Updates
- `/react-app` - New guardian UI components and updated DatabaseHandler
- `/react-app/src/components` - New guardian components added
- `/react-app/src/services` - DatabaseHandler guardian methods added

### New Functions to Document
List all new functions that must be added to appropriate `CLAUDE.md` files:
- `DatabaseHandler.createGuardian` - Creates new guardian with student assignments
- `DatabaseHandler.updateGuardian` - Updates guardian info and relationships
- `DatabaseHandler.deleteGuardian` - Removes guardian from system
- `GuardiansMainPanel` component - Main guardian list management
- `GuardianCard` component - Individual guardian display
- `GuardianSidePanel` component - Guardian CRUD operations form

### New Files to Document
List all new files that must be added to appropriate `CLAUDE.md` files:
- `/react-app/src/components/main-panel/GuardiansMainPanel.tsx` - Guardian list view container
- `/react-app/src/components/cards/GuardianCard.tsx` - Guardian card display component
- `/react-app/src/components/side-panels/GuardianSidePanel.tsx` - Guardian form panel

### Architectural Changes to Document
- Addition of Guardian management UI following established Student UI patterns
- Student assignment interface pattern within guardian forms
- Integration of guardian CRUD operations with existing DatabaseHandler patterns

## Implementation Instructions for Claude Code

**CRITICAL: During implementation, you MUST:**

1. **Before making any commits**: Update all identified `CLAUDE.md` files with new functions, files, and architectural changes
2. **For each new function**: Add entry to appropriate `CLAUDE.md` following the established format
3. **For each new file**: Add file description to relevant directory's `CLAUDE.md`
4. **For architectural changes**: Update relevant sections in affected `CLAUDE.md` files
5. **Commit documentation updates**: Include `CLAUDE.md` updates in your commits alongside code changes
6. **Verify completeness**: Ensure no new functionality is missing from documentation before final commit

**Upon completion, you MUST:**

7. **Create completion summary**: Use the criteria in the next 3 items in this list to create a completion document in the `ref/` folder named `guardian-ui-completion.md`
8. **Document all changes**: List every file modified, function created, and documentation updated
9. **Prepare for handoff**: In completion document, include specific testing requirements and review focus areas for Phase 4

**Documentation updates and completion summary are not optional - they are required for issue completion.**