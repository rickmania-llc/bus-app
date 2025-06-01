import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Student {
  id: string
  name: string
  grade: string
  busNumber?: string
}

interface StudentState {
  students: Student[]
  loading: boolean
  error: string | null
}

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null
}

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
    }
  }
})

export const { 
  setStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent, 
  setLoading, 
  setError 
} = studentSlice.actions

export default studentSlice.reducer