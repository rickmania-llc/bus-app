import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { Student } from '../../../../common/types'
import { isElectron } from '../../utils/environment'

// Extend the common Student type with an id field for Redux state
interface StudentWithId extends Student {
  id: string
}

// Type for Firebase update events
interface FirebaseUpdate {
  type: 'value' | 'child_added' | 'child_changed' | 'child_removed'
  data?: Record<string, Student> | Student
  key?: string
}

// Type for the window with electronAPI
interface WindowWithElectronAPI extends Window {
  electronAPI: {
    invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
    on: (channel: string, callback: (update: FirebaseUpdate) => void) => () => void
  }
  __studentListenerCleanup?: () => void
}

interface StudentState {
  students: StudentWithId[]
  loading: boolean
  error: string | null
  listenersActive: boolean
}

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
  listenersActive: false
}

// Helper function to transform Firebase data to Redux format
function transformFirebaseToRedux(firebaseData: Record<string, Student>): StudentWithId[] {
  return Object.entries(firebaseData || {}).map(([id, data]) => ({
    id,
    ...data
  } as StudentWithId))
}

// Async thunk to setup student listeners
export const setupStudentListeners = createAsyncThunk(
  'students/setupListeners',
  async (tenant: string = 'dev', { dispatch }) => {
    if (!isElectron()) {
      console.warn('Not in Electron environment, skipping IPC listeners')
      return { success: false, reason: 'Not in Electron' }
    }

    const electronWindow = window as WindowWithElectronAPI

    try {
      // Setup the listener on the main process with tenant
      console.log(`Setting up student listeners for tenant: ${tenant}`)
      await electronWindow.electronAPI.invoke('setup-students-listener', { tenant })
      
      // Setup event handler for real-time updates
      const removeListener = electronWindow.electronAPI.on('students-updated', 
        (update: FirebaseUpdate) => {
          console.log('Received student update:', update.type, update.key || 'bulk')
          
          switch (update.type) {
            case 'value': {
              // Full data replacement
              const students = transformFirebaseToRedux(update.data as Record<string, Student> || {})
              dispatch(setStudentsFromFirebase(students))
              break
            }
              
            case 'child_added':
              // Single student added
              if (update.key && update.data) {
                const newStudent: StudentWithId = { id: update.key, ...(update.data as Student) }
                dispatch(addStudentFromFirebase(newStudent))
              }
              break
              
            case 'child_changed':
              // Single student updated
              if (update.key && update.data) {
                const updatedStudent: StudentWithId = { id: update.key, ...(update.data as Student) }
                dispatch(updateStudentFromFirebase(updatedStudent))
              }
              break
              
            case 'child_removed':
              // Single student removed
              if (update.key) {
                dispatch(removeStudentFromFirebase(update.key))
              }
              break
          }
        }
      )
      
      // Store the cleanup function
      electronWindow.__studentListenerCleanup = removeListener
      
      return { success: true, removeListener }
    } catch (error) {
      console.error('Failed to setup student listeners:', error)
      throw error
    }
  }
)

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<StudentWithId[]>) => {
      state.students = action.payload
    },
    addStudent: (state, action: PayloadAction<StudentWithId>) => {
      state.students.push(action.payload)
    },
    updateStudent: (state, action: PayloadAction<StudentWithId>) => {
      const index = state.students.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.students[index] = action.payload
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(s => s.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    // Firebase-specific reducers with console logging
    setStudentsFromFirebase: (state, action: PayloadAction<StudentWithId[]>) => {
      console.log(`[Redux] Setting ${action.payload.length} students from Firebase`)
      state.students = action.payload
      state.loading = false
      state.error = null
    },
    addStudentFromFirebase: (state, action: PayloadAction<StudentWithId>) => {
      console.log(`[Redux] Adding student from Firebase:`, action.payload.id, action.payload.name)
      // Check if student already exists (in case of duplicate events)
      const exists = state.students.some(s => s.id === action.payload.id)
      if (!exists) {
        state.students.push(action.payload)
      }
    },
    updateStudentFromFirebase: (state, action: PayloadAction<StudentWithId>) => {
      console.log(`[Redux] Updating student from Firebase:`, action.payload.id, action.payload.name)
      const index = state.students.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.students[index] = action.payload
      }
    },
    removeStudentFromFirebase: (state, action: PayloadAction<string>) => {
      console.log(`[Redux] Removing student from Firebase:`, action.payload)
      state.students = state.students.filter(s => s.id !== action.payload)
    },
    setListenersActive: (state, action: PayloadAction<boolean>) => {
      state.listenersActive = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setupStudentListeners.pending, (state) => {
        state.loading = true
      })
      .addCase(setupStudentListeners.fulfilled, (state) => {
        state.listenersActive = true
        state.loading = false
      })
      .addCase(setupStudentListeners.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to setup listeners'
        state.listenersActive = false
      })
  }
})

export const { 
  setStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent, 
  setLoading, 
  setError,
  setStudentsFromFirebase,
  addStudentFromFirebase,
  updateStudentFromFirebase,
  removeStudentFromFirebase,
  setListenersActive
} = studentSlice.actions

export default studentSlice.reducer