import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { Student } from '../../types/models/Student'
import { isElectron } from '../../utils/environment'

// Type for Firebase update events
interface FirebaseUpdate {
  type: 'value' | 'child_added' | 'child_changed' | 'child_removed'
  data?: Record<string, Student> | Student
  key?: string
}

// Extend the global Window interface for student-specific cleanup
declare global {
  interface Window {
    __studentListenerCleanup?: () => void
  }
}

interface StudentState {
  students: Student[]
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
function transformFirebaseToRedux(firebaseData: Record<string, Omit<Student, 'id'>>): Student[] {
  return Object.entries(firebaseData || {}).map(([id, data]) => ({
    id,
    ...data
  } as Student))
}

// Async thunk to setup student listeners
export const setupStudentListeners = createAsyncThunk(
  'students/setupListeners',
  async (tenant: string = 'dev', { dispatch, getState }) => {
    if (!isElectron()) {
      console.warn('Not in Electron environment, skipping IPC listeners')
      return { success: false, reason: 'Not in Electron' }
    }
    
    // Check if listeners are already active
    const state = getState() as { students: StudentState }
    if (state.students.listenersActive) {
      console.log('Student listeners already active, skipping setup')
      return { success: false, reason: 'Listeners already active' }
    }
    
    // Clean up any existing listener
    if (window.__studentListenerCleanup) {
      console.log('Cleaning up existing student listener')
      window.__studentListenerCleanup()
      window.__studentListenerCleanup = undefined
    }

    if (!window.electronAPI) {
      return { success: false, reason: 'electronAPI not available' }
    }
    
    const { electronAPI } = window

    try {
      // Setup the listener on the main process with tenant
      console.log(`Setting up student listeners for tenant: ${tenant}`)
      await electronAPI.invoke('setup-students-listener', { tenant })
      
      // Setup event handler for real-time updates
      const removeListener = electronAPI.on('students-updated', 
        (update: FirebaseUpdate) => {
          console.log('Received student update:', update.type, update.key || 'bulk')
          
          switch (update.type) {
            case 'value': {
              // Full data replacement
              const students = transformFirebaseToRedux(update.data as Record<string, Omit<Student, 'id'>> || {})
              console.log('GOT STUDENTS', students);
              dispatch(setStudentsFromFirebase(students))
              break
            }
              
            case 'child_added':
              // Single student added
              if (update.key && update.data) {
                const newStudent: Student = { id: update.key, ...(update.data as Omit<Student, 'id'>) }
                dispatch(addStudentFromFirebase(newStudent))
              }
              break
              
            case 'child_changed':
              // Single student updated
              if (update.key && update.data) {
                const updatedStudent: Student = { id: update.key, ...(update.data as Omit<Student, 'id'>) }
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
      window.__studentListenerCleanup = removeListener
      
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
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload)
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
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
    setStudentsFromFirebase: (state, action: PayloadAction<Student[]>) => {
      console.log(`[Redux] Setting ${action.payload.length} students from Firebase`)
      state.students = action.payload
      state.loading = false
      state.error = null
      // Log the current state
      console.log('[Redux] Current student state:', JSON.stringify(state.students.map(s => ({ id: s.id, name: s.name }))))
    },
    addStudentFromFirebase: (state, action: PayloadAction<Student>) => {
      console.log(`[Redux] Adding student from Firebase:`, action.payload.id, action.payload.name)
      // Check if student already exists (in case of duplicate events)
      const exists = state.students.some(s => s.id === action.payload.id)
      if (!exists) {
        state.students.push(action.payload)
        console.log('[Redux] Student added. Current count:', state.students.length)
      } else {
        console.log('[Redux] Student already exists, skipping add')
      }
      // Log the current state
      console.log('[Redux] Current student state:', JSON.stringify(state.students.map(s => ({ id: s.id, name: s.name }))))
    },
    updateStudentFromFirebase: (state, action: PayloadAction<Student>) => {
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
      .addCase(setupStudentListeners.fulfilled, (state, action) => {
        // Only mark as active if setup was successful
        if (action.payload?.success) {
          state.listenersActive = true
        }
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