# User Story Development Specification

## Story Identifier
**Story ID:** GUI-001-02  
**Story Name:** Guardian List View  
**Epic:** Guardian Management UI Implementation  
**Priority:** P0 - Critical  
**Weight:** 5

---

## Story Objective
**User Story:**  
As a system administrator  
I need to view all guardians in a grid layout  
So that I can quickly browse and manage guardian records

**Technical Objective:**  
Implement the main guardian list view component that displays all guardians in a responsive grid layout with loading states, error handling, and real-time updates. This component will serve as the primary interface for guardian management, following the established pattern from the Student management system.

---

## Prerequisites

### Dependencies Completed
- [x] GUI-001-01 - Database and State Management Foundation (provides DatabaseHandler methods and Redux state integration)
- [x] Firebase Realtime Database configured with guardian data structure
- [x] Redux guardian slice implemented with actions and reducers
- [x] Authentication system (basic setup for tenant context)

### Environment Setup Required
```bash
# Services that must be running
- Firebase emulators (Realtime Database, Functions)
- React development server (Vite)
- Node.js 22+ runtime

# Commands to start environment
yarn emulators  # Terminal 1
cd react-app && yarn dev  # Terminal 2
```

### Required Access
- [x] Read access to Firebase Realtime Database guardians collection
- [x] Write access to React application src directory
- [x] Access to Redux store for state management

---

## Implementation Specifications

### Files to Create

#### `react-app/src/components/main-panel/GuardiansMainPanel.tsx`
**Purpose:** Main container component for displaying guardian list with controls  
**Exports:** Default export of GuardiansMainPanel component  
**Implementation:**
```typescript
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Plus } from 'lucide-react'
import { RootState } from '../../redux/store'
import GuardianCard from '../cards/GuardianCard'
import GuardianSidePanel from '../side-panels/GuardianSidePanel'

export default function GuardiansMainPanel() {
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  const { guardians, loading, error } = useSelector((state: RootState) => state.guardians)
  const { students } = useSelector((state: RootState) => state.students)
  
  const handleGuardianSelect = (guardianId: string) => {
    // Exit create mode if we're in it
    if (isCreating) {
      setIsCreating(false)
    }
    
    // Toggle selection
    setSelectedGuardianId(guardianId === selectedGuardianId ? null : guardianId)
  }
  
  const handleClearSelection = () => {
    setSelectedGuardianId(null)
  }
  
  const handleCreateClick = () => {
    setIsCreating(true)
    setSelectedGuardianId(null) // Clear any existing selection
  }
  
  const handleCloseCreate = () => {
    setIsCreating(false)
  }
  
  const selectedGuardian = selectedGuardianId 
    ? guardians.find(g => g.id === selectedGuardianId) 
    : null
  
  // Helper function to get assigned students for a guardian
  const getAssignedStudents = (guardianId: string) => {
    const guardian = guardians.find(g => g.id === guardianId)
    if (!guardian || !guardian.students) return []
    
    return Object.keys(guardian.students)
      .map(studentId => students.find(s => s.id === studentId))
      .filter(Boolean)
  }
  
  // Helper function to get primary student for a guardian
  const getPrimaryStudent = (guardianId: string) => {
    const guardian = guardians.find(g => g.id === guardianId)
    if (!guardian || !guardian.students) return null
    
    const primaryStudentId = Object.keys(guardian.students)
      .find(id => guardian.students[id]?.isPrimaryGuardian === true)
    
    return primaryStudentId ? students.find(s => s.id === primaryStudentId) : null
  }
  
  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Guardians</h1>
            <button
              disabled
              className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              Add Guardian
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  // Error state with retry option
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Guardians</h1>
            <button
              onClick={handleCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Guardian
            </button>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 mb-2">Error loading guardians: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-red-600 underline hover:text-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Main render with guardian list or empty state
  return (
    <div className="flex h-full">
      <div className={`flex-1 p-8 transition-all duration-300 ${selectedGuardian || isCreating ? 'pr-4' : ''}`}>
        <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Guardians</h1>
            <button
              onClick={handleCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Guardian
            </button>
          </div>
          
          {guardians.length === 0 ? (
            // Empty state
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <svg 
                    className="w-24 h-24 mx-auto text-gray-300"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">No guardians found</p>
                <p className="text-gray-400">Click "Add Guardian" to create your first guardian record</p>
              </div>
            </div>
          ) : (
            // Guardian grid
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {guardians.map((guardian) => (
                  <GuardianCard
                    key={guardian.id}
                    guardian={guardian}
                    studentCount={Object.keys(guardian.students || {}).length}
                    primaryStudent={getPrimaryStudent(guardian.id)}
                    isSelected={guardian.id === selectedGuardianId}
                    onSelect={handleGuardianSelect}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Side panel for editing selected guardian */}
      {selectedGuardian && !isCreating && (
        <GuardianSidePanel
          guardian={selectedGuardian}
          assignedStudents={getAssignedStudents(selectedGuardian.id)}
          onClose={handleClearSelection}
        />
      )}
      
      {/* Side panel for creating new guardian */}
      {isCreating && (
        <GuardianSidePanel
          mode="create"
          assignedStudents={[]}
          onClose={handleCloseCreate}
        />
      )}
    </div>
  )
}
```

### Files to Modify

#### `react-app/src/components/Layout.tsx`
**Current State:** Layout component with navigation and routing  
**Modifications Required:**
```typescript
// ADD import at the top
import GuardiansMainPanel from './main-panel/GuardiansMainPanel'

// MODIFY the route configuration to include Guardians panel
// In the component rendering section where routes are defined:
{selectedItem === 'guardians' && <GuardiansMainPanel />}

// Note: The exact location depends on the current Layout implementation
// Follow the same pattern as the Students route
```

#### `react-app/src/utils/firebase/DatabaseHandler.ts`
**Current State:** Handles Firebase database operations  
**Modifications Required:**
```typescript
// ENSURE the guardian listener is properly set up
// This should already be implemented from Story 1, but verify:

static setupGuardianListener(
  dispatch: AppDispatch,
  tenantDatabase: string
): () => void {
  const guardiansRef = ref(getDatabase(), 'guardians')
  
  const unsubscribe = onValue(
    guardiansRef,
    (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const guardiansArray = Object.entries(data).map(([id, guardian]: [string, any]) => ({
          id,
          ...guardian,
          students: guardian.students || {}
        }))
        dispatch(setGuardians(guardiansArray))
      } else {
        dispatch(setGuardians([]))
      }
      dispatch(setLoading(false))
    },
    (error) => {
      console.error('Error loading guardians:', error)
      dispatch(setError(error.message))
      dispatch(setLoading(false))
    }
  )
  
  // Set loading state initially
  dispatch(setLoading(true))
  
  return unsubscribe
}
```

### Stub Files for Dependencies

Since GuardianCard and GuardianSidePanel are part of Story 3, we need minimal stubs:

#### `react-app/src/components/cards/GuardianCard.tsx` (Stub)
```typescript
// TEMPORARY STUB - Will be fully implemented in Story 3
import { Guardian } from '../../types/models/Guardian'
import { Student } from '../../types/models/Student'

interface GuardianCardProps {
  guardian: Guardian
  studentCount: number
  primaryStudent: Student | null
  isSelected: boolean
  onSelect: (guardianId: string) => void
}

export default function GuardianCard({ 
  guardian, 
  studentCount, 
  primaryStudent, 
  isSelected, 
  onSelect 
}: GuardianCardProps) {
  return (
    <div
      onClick={() => onSelect(guardian.id)}
      className={`
        border rounded-lg p-4 cursor-pointer transition-all
        ${isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:shadow-sm'}
      `}
    >
      <h3 className="font-semibold text-gray-800">{guardian.name}</h3>
      <p className="text-sm text-gray-600">ID: {guardian.govId.slice(-4).padStart(4, '*')}</p>
      <p className="text-sm text-gray-500 mt-2">
        {studentCount} student{studentCount !== 1 ? 's' : ''}
      </p>
      {primaryStudent && (
        <p className="text-xs text-blue-600 mt-1">Primary: {primaryStudent.name}</p>
      )}
    </div>
  )
}
```

#### `react-app/src/components/side-panels/GuardianSidePanel.tsx` (Stub)
```typescript
// TEMPORARY STUB - Will be fully implemented in Story 3
import { Guardian } from '../../types/models/Guardian'
import { Student } from '../../types/models/Student'
import { X } from 'lucide-react'

interface GuardianSidePanelProps {
  guardian?: Guardian
  mode?: 'create' | 'edit'
  assignedStudents: Student[]
  onClose: () => void
}

export default function GuardianSidePanel({ 
  guardian, 
  mode = 'edit', 
  assignedStudents, 
  onClose 
}: GuardianSidePanelProps) {
  return (
    <div className="w-96 bg-white shadow-lg p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {mode === 'create' ? 'Add Guardian' : 'Edit Guardian'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="text-gray-500">Guardian panel will be implemented in Story 3</p>
    </div>
  )
}
```

---

## Component Structure & Patterns

### Component Hierarchy
```
GuardiansMainPanel
├── Loading State (Skeleton UI)
├── Error State (with Retry)
├── Empty State
└── Main Content
    ├── Header
    │   ├── Title
    │   └── Add Guardian Button
    └── Guardian Grid
        └── GuardianCard (multiple)
            ├── Guardian Info
            ├── Student Count
            └── Primary Student
```

### State Management Pattern
```typescript
// Local Component State
- selectedGuardianId: string | null  // Currently selected guardian
- isCreating: boolean                 // Whether in create mode

// Redux State (from store)
- guardians: Guardian[]               // List of all guardians
- loading: boolean                    // Loading state
- error: string | null               // Error message
- students: Student[]                // For relationship display
```

### Responsive Design Breakpoints
- **Mobile (< 768px)**: 1 column grid
- **Tablet (768px - 1024px)**: 2 column grid  
- **Desktop (> 1024px)**: 4 column grid

---

## Real-time Update Implementation

### Firebase Listener Integration
The component will automatically receive real-time updates through the Firebase listener set up in DatabaseHandler. When guardians are added, modified, or deleted in the database:

1. Firebase listener detects change
2. Listener dispatches Redux action with new data
3. Redux store updates
4. Component re-renders with new data
5. Selected guardian remains selected (if still exists)

### Handling Edge Cases
```typescript
// When selected guardian is deleted
useEffect(() => {
  if (selectedGuardianId && !guardians.find(g => g.id === selectedGuardianId)) {
    setSelectedGuardianId(null)
  }
}, [guardians, selectedGuardianId])
```

---

## Error Handling

### Expected Error Scenarios
| Scenario | User Message | Developer Action |
|----------|--------------|------------------|
| Firebase connection lost | "Error loading guardians: Network error" | Log to console, show retry |
| Permission denied | "Error loading guardians: Permission denied" | Check tenant header |
| Invalid data format | "Error loading guardians: Invalid data" | Validate data structure |
| Rate limit exceeded | "Too many requests. Please wait." | Implement exponential backoff |

### Error Recovery Strategy
```typescript
// Automatic retry with exponential backoff
const retryWithBackoff = (retryCount = 0) => {
  const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)
  setTimeout(() => {
    // Re-establish Firebase listener
    DatabaseHandler.setupGuardianListener(dispatch, tenantDatabase)
  }, delay)
}
```

---

## Test Implementation

### Unit Tests Required

#### `react-app/src/components/main-panel/__tests__/GuardiansMainPanel.test.tsx`
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import GuardiansMainPanel from '../GuardiansMainPanel'
import guardianReducer from '../../../redux/slices/guardianSlice'
import studentReducer from '../../../redux/slices/studentSlice'

describe('GuardiansMainPanel', () => {
  const createMockStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        guardians: guardianReducer,
        students: studentReducer
      },
      preloadedState: initialState
    })
  }
  
  describe('Loading State', () => {
    it('should display skeleton UI when loading', () => {
      const store = createMockStore({
        guardians: { guardians: [], loading: true, error: null }
      })
      
      render(
        <Provider store={store}>
          <GuardiansMainPanel />
        </Provider>
      )
      
      expect(screen.getByText('Guardians')).toBeInTheDocument()
      expect(screen.getAllByTestId('skeleton-card')).toHaveLength(8)
      expect(screen.getByText('Add Guardian')).toBeDisabled()
    })
  })
  
  describe('Error State', () => {
    it('should display error message with retry option', () => {
      const store = createMockStore({
        guardians: { 
          guardians: [], 
          loading: false, 
          error: 'Connection failed' 
        }
      })
      
      render(
        <Provider store={store}>
          <GuardiansMainPanel />
        </Provider>
      )
      
      expect(screen.getByText(/Error loading guardians/)).toBeInTheDocument()
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })
  })
  
  describe('Empty State', () => {
    it('should display helpful message when no guardians exist', () => {
      const store = createMockStore({
        guardians: { guardians: [], loading: false, error: null }
      })
      
      render(
        <Provider store={store}>
          <GuardiansMainPanel />
        </Provider>
      )
      
      expect(screen.getByText('No guardians found')).toBeInTheDocument()
      expect(screen.getByText(/Click "Add Guardian"/)).toBeInTheDocument()
    })
  })
  
  describe('Guardian List Display', () => {
    it('should display guardian cards in grid layout', () => {
      const mockGuardians = [
        {
          id: '1',
          name: 'John Doe',
          govId: '123456789',
          pictureUrl: null,
          students: { 's1': { reference: true, isPrimaryGuardian: true } },
          createdAt: Date.now()
        },
        {
          id: '2',
          name: 'Jane Smith',
          govId: '987654321',
          pictureUrl: null,
          students: {},
          createdAt: Date.now()
        }
      ]
      
      const store = createMockStore({
        guardians: { guardians: mockGuardians, loading: false, error: null },
        students: { students: [], loading: false, error: null }
      })
      
      render(
        <Provider store={store}>
          <GuardiansMainPanel />
        </Provider>
      )
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })
  
  describe('Add Guardian Button', () => {
    it('should trigger create mode when clicked', () => {
      const store = createMockStore({
        guardians: { guardians: [], loading: false, error: null }
      })
      
      render(
        <Provider store={store}>
          <GuardiansMainPanel />
        </Provider>
      )
      
      const addButton = screen.getByText('Add Guardian')
      fireEvent.click(addButton)
      
      // Should show create panel (stub for now)
      expect(screen.getByText('Add Guardian')).toBeInTheDocument()
    })
  })
  
  describe('Guardian Selection', () => {
    it('should select guardian when card is clicked', () => {
      const mockGuardian = {
        id: '1',
        name: 'John Doe',
        govId: '123456789',
        pictureUrl: null,
        students: {},
        createdAt: Date.now()
      }
      
      const store = createMockStore({
        guardians: { guardians: [mockGuardian], loading: false, error: null }
      })
      
      render(
        <Provider store={store}>
          <GuardiansMainPanel />
        </Provider>
      )
      
      const guardianCard = screen.getByText('John Doe').closest('div')
      fireEvent.click(guardianCard!)
      
      // Should show edit panel (stub for now)
      expect(screen.getByText('Edit Guardian')).toBeInTheDocument()
    })
    
    it('should deselect guardian when clicked again', () => {
      // Implementation...
    })
  })
})
```

### Integration Tests Required

#### `react-app/src/components/main-panel/__tests__/GuardiansMainPanel.integration.test.tsx`
```typescript
describe('GuardiansMainPanel Integration', () => {
  it('should update when guardians are added via Redux', async () => {
    // Test that component updates when Redux state changes
  })
  
  it('should maintain selection when list updates', async () => {
    // Test that selected guardian remains selected after real-time update
  })
  
  it('should clear selection when selected guardian is deleted', async () => {
    // Test edge case handling
  })
})
```

---

## Acceptance Criteria Checklist

### Functional Requirements
- [ ] GuardiansMainPanel component displays when "Guardians" is selected in navigation
- [ ] Grid layout shows guardian cards in responsive columns (4 on desktop, 2 on tablet, 1 on mobile)
- [ ] "Add Guardian" button prominently displayed in top-right corner
- [ ] Loading skeleton shows during initial data fetch with animated placeholders
- [ ] Empty state displays helpful message when no guardians exist
- [ ] Error state shows user-friendly message with retry option
- [ ] Real-time updates when guardians are added/modified/deleted
- [ ] Guardian cards are clickable and show selection state
- [ ] Create mode opens side panel for new guardian
- [ ] Edit mode opens side panel for selected guardian

### Technical Requirements
- [ ] Component follows established StudentsMainPanel pattern
- [ ] TypeScript types properly defined for all props and state
- [ ] Redux integration working correctly with guardian slice
- [ ] Firebase listener properly updates component via Redux
- [ ] No memory leaks from event listeners
- [ ] Component properly unmounts and cleans up
- [ ] Responsive design works on all screen sizes
- [ ] Tailwind CSS classes used consistently
- [ ] No console errors or warnings
- [ ] Component is accessible (ARIA labels, keyboard navigation)

### Performance Requirements
- [ ] Initial render completes in < 100ms
- [ ] Grid renders efficiently with up to 100 guardians
- [ ] Smooth transitions for selection states
- [ ] No unnecessary re-renders (use React DevTools Profiler)
- [ ] Skeleton UI provides good perceived performance

---

## Development Checklist

### Before Starting
- [ ] Pull latest code from `cmad-new` branch
- [ ] Run `yarn install` in react-app directory
- [ ] Verify Firebase emulators are running
- [ ] Confirm Story 1 (GUI-001-01) is complete and merged
- [ ] Review StudentsMainPanel implementation for patterns

### During Development
- [ ] Create feature branch: `feature/GUI-001-02-guardian-list-view`
- [ ] Implement GuardiansMainPanel component
- [ ] Create stub components for GuardianCard and GuardianSidePanel
- [ ] Update Layout component to include Guardian route
- [ ] Test responsive design at all breakpoints
- [ ] Verify real-time updates work correctly
- [ ] Write unit tests with > 80% coverage
- [ ] Test with various data states (empty, few, many guardians)
- [ ] Ensure loading and error states work properly
- [ ] Check accessibility with screen reader

### Before Completion
- [ ] All acceptance criteria met
- [ ] All tests passing (`yarn test`)
- [ ] No TypeScript errors (`yarn tsc`)
- [ ] Code passes linting (`yarn lint`)
- [ ] Component works in Firefox, Chrome, Safari
- [ ] Mobile responsive design verified on actual devices
- [ ] Performance acceptable with 50+ guardian records
- [ ] Documentation updated (if needed)
- [ ] Self-review completed
- [ ] Code committed with meaningful messages

### Definition of Done
- [ ] Code merged to `cmad-new` branch
- [ ] All tests passing in CI/CD pipeline
- [ ] Component working with Firebase emulators
- [ ] Real-time updates verified with multiple browser tabs
- [ ] No regressions in existing functionality
- [ ] Story marked complete in project tracking
- [ ] Team demo completed successfully
- [ ] Next story (GUI-001-03) can begin without blockers

---

## Notes & Clarifications

### Design Decisions
1. **Grid Layout**: Using 4-column layout on desktop (vs 3 for students) to accommodate typically larger guardian datasets
2. **Loading Skeletons**: Showing 8 skeleton cards to fill viewport and provide better loading experience
3. **Selection Pattern**: Following same toggle selection as StudentsMainPanel for consistency
4. **Empty State**: Using people group icon to represent guardians conceptually

### Security Considerations
- Government ID is partially masked in the UI (showing only last 4 digits)
- Never log full government ID to console
- Ensure tenant isolation is maintained in all operations
- Profile pictures loaded over HTTPS only

### Performance Optimizations
1. **Memoization**: Consider using `React.memo` for GuardianCard in Story 3
2. **Virtual Scrolling**: May need to implement if guardian lists exceed 200 items
3. **Lazy Loading**: Profile pictures should load lazily in Story 3
4. **Debouncing**: Search/filter operations in Story 5 will need debouncing

### Future Enhancements (Not in This Story)
- Search and filter capabilities (Story 5)
- Bulk operations (select multiple guardians)
- Export guardian list to CSV
- Print-friendly view
- Guardian photos with fallback avatars (Story 3)
- Sort options (alphabetical, date added, student count)

### Known Limitations
- Maximum of ~500 guardians before performance degradation (will need pagination)
- No offline support currently
- No keyboard shortcuts for navigation
- No drag-and-drop for reordering

### Testing Considerations
- Test with guardians having 0, 1, and multiple students
- Test with very long guardian names (truncation)
- Test with special characters in names
- Test rapid selection/deselection
- Test with slow network conditions
- Test with Firebase connection interruption

---

**Story Generated:** 2025-09-07  
**Scrum Master:** CMAD AI Assistant  
**Source:** Guardian Management UI Implementation Epic v1.0  
**Sprint:** Sprint 1 - Foundation Phase