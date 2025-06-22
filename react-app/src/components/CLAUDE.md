# React Components Module

## Directory Purpose
Presentational React components that make up the user interface of the bus tracking admin dashboard. Components are organized by their role in the application layout, with a focus on reusability and clear separation of concerns.

## Architecture Notes
- TypeScript for type safety with interface definitions
- Tailwind CSS for styling with utility classes
- Lucide React icons for consistent iconography
- Component composition pattern with props drilling
- Stateless presentational components where possible
- Panel-based architecture for main content areas
- Card-based UI pattern for entity display
- Local selection state management within main panels
- Side panel pattern for editing selected entities

## Files Overview

### `NavigationPanel.tsx`
**Purpose:** Left sidebar navigation menu component
**Key Features:**
- Displays navigation items with icons and labels
- Active state management with visual feedback
- Responsive hover states and transitions
- System status indicator in footer

**Props Interface:**
- `onItemClick?: (item: NavigationItem) => void` - Callback when navigation item clicked
- `activeItemId?: string` - Currently active navigation item ID
- `className?: string` - Additional CSS classes

**Navigation Items:**
- Dashboard (Home icon)
- Routes (Route icon)
- Students (GraduationCap icon)
- Drivers (Car icon)

### `MainPanel.tsx`
**Purpose:** Content area router that displays appropriate panel based on selection
**Key Functions:**
- `renderContent()` - Switch statement routing to appropriate panel component
- Returns panel components based on selectedItem prop

**Props Interface:**
- `selectedItem: string` - Current navigation selection

**Routed Panels:**
- dashboard → DashboardMainPanel
- routes → RoutesMainPanel
- students → StudentsMainPanel
- drivers → DriversMainPanel

### `main-panel/DashboardMainPanel.tsx`
**Purpose:** Dashboard overview panel with placeholder content
**Key Features:**
- Clean card-based layout
- Placeholder for charts and metrics
- Info box highlighting future content area

### `main-panel/RoutesMainPanel.tsx`
**Purpose:** Routes management panel (placeholder)
**Expected Features:**
- Route templates listing
- Active routes calendar view
- Route creation and editing

### `main-panel/StudentsMainPanel.tsx`
**Purpose:** Students management panel with card display, creation, and editing capabilities
**Key Functions:**
- `handleStudentSelect(studentId: string)` - Updates selectedStudentId state, toggles selection, exits create mode if active
- `handleClearSelection()` - Clears selected student
- `handleCreateClick()` - Triggers create mode for new student, clears any existing selection
- `handleCloseCreate()` - Closes create mode panel
- `getPrimaryGuardian(studentId: string)` - Finds primary guardian for a student

**Features:**
- Card-based student display with grid layout
- "Add Student" button with Plus icon in header
- Local selection state management using useState
- Dual state management for selection and creation modes
- Automatic mode switching: selecting a student exits create mode
- Side panel for editing selected students
- Side panel for creating new students
- Loading states with skeleton cards
- Empty state messaging
- Error state handling
- Integration with Redux for student and guardian data

### `main-panel/DriversMainPanel.tsx`
**Purpose:** Drivers management panel (placeholder)
**Expected Features:**
- Driver list and profiles
- Driver assignment to routes
- Driver availability management

### `cards/StudentCard.tsx`
**Purpose:** Reusable card component for displaying individual student information
**Key Functions:**
- `calculateAge(dob: number)` - Calculates student age from date of birth timestamp
- `formatAddress(address: string)` - Extracts first line of address for display

**Props Interface:**
- `student: Student` - Student data to display
- `primaryGuardian?: Guardian` - Optional primary guardian information
- `isSelected: boolean` - Selection state for visual highlighting
- `onSelect: (studentId: string) => void` - Callback for selection handling

**Features:**
- Profile picture with fallback avatar
- Displays name, age, address snippet
- Shows primary guardian name if available
- Visual selection state with border color
- Click handling for selection
- Responsive hover effects

### `side-panels/StudentSidePanel.tsx`
**Purpose:** Side panel component for creating and editing student information with full CRUD operations
**Key Functions:**
- `handleInputChange` - Updates form state for controlled inputs, clears errors on change
- `handleSubmit` - Handles both create and update operations
  - In create mode: Calls DatabaseHandler.createStudent with new student data
    - Resets form to blank values after successful creation
    - Ensures clean state for subsequent creates
  - In edit mode: Calls DatabaseHandler.updateStudent with changes
  - Handles date conversion for DOB field
  - Shows loading state during save
  - Closes panel on success
  - Displays context-aware error messages on failure
- `handleDelete` - Deletes student via DatabaseHandler.deleteStudent
  - Only available in edit mode
  - Shows confirmation modal before deletion
  - Handles loading state during deletion
  - Closes panel on success
  - Displays error messages on failure

**Props Interface:**
- `mode?: 'edit' | 'create'` - Determines panel behavior (defaults to 'edit')
- `student?: Student` - Selected student data (optional for create mode)
- `guardians: Guardian[]` - List of guardians associated with student
- `onClose: () => void` - Callback to close the panel

**Features:**
- Dual-mode operation (create/edit) with appropriate UI changes
- Context-aware title ("Add Student" vs "Edit Student")
- Form for entering/editing student details (name, DOB, address, picture URL)
- Automatic form reset when switching to create mode
- Form data persistence when editing existing students
- Profile picture display with fallback (edit mode only)
- Guardian relationship display (primary and secondary) in edit mode
- Save functionality with context-aware button text
- Delete functionality with confirmation modal (edit mode only)
- Loading spinners during async operations
- Error message display with user-friendly messages
- Disabled form fields during save/delete operations
- Responsive form layout
- Smooth close animation

**State Management:**
- useEffect hook monitors mode and student props
- Resets form to blank values when mode === 'create'
- Populates form with student data when mode === 'edit' and student exists
- Clears errors on mode change for better UX

## Key Dependencies
- `lucide-react` - Icon library for navigation and UI elements
- React hooks (useState) for local state management
- TypeScript for type definitions

## Common Workflows
1. **Navigation Flow:** User clicks nav item → NavigationPanel calls onItemClick → Container updates selectedItem → MainPanel renders new content
2. **Panel Switching:** MainPanel receives selectedItem → renderContent() matches to panel → Returns appropriate component
3. **State Management:** Local state in NavigationPanel for UI → Lifted state in container for app state
4. **Student Selection Flow:** User clicks StudentCard → handleStudentSelect toggles selection → Side panel renders with student data
5. **Entity Editing Flow:** Side panel displays form → User edits fields → Save calls DatabaseHandler CRUD method → Loading state shown → Panel closes on success → Redux updates via listeners
6. **Student Creation Flow:** User clicks "Add Student" → handleCreateClick sets isCreating → StudentSidePanel opens in create mode → User fills form → Submit calls DatabaseHandler.createStudent → Form resets to blank → Panel closes → Redux updates via listeners

## Performance Considerations
- Panels are not lazy loaded (could be optimized for larger app)
- Navigation state is local to reduce re-renders
- Tailwind classes are purged in production build

## Security Notes
- No direct API calls from presentational components
- All data should come through props from containers
- No sensitive information stored in component state

## Styling Patterns
- Consistent color scheme: gray-800 for nav, blue-600 for primary actions
- Rounded corners (rounded-lg) for modern appearance
- Shadow effects for depth (shadow-lg, shadow-sm)
- Transition animations for smooth interactions
- Responsive design with flex layouts

## Future Enhancements
- Add routing with react-router-dom
- Implement real panel content with data
- Add breadcrumb navigation
- Include user profile section
- Add notification center
- Implement search functionality