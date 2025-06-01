import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Guardian {
  id: string
  name: string
  email: string
  phone: string
  studentIds: string[]
}

interface GuardianState {
  guardians: Guardian[]
  loading: boolean
  error: string | null
}

const initialState: GuardianState = {
  guardians: [],
  loading: false,
  error: null
}

const guardianSlice = createSlice({
  name: 'guardians',
  initialState,
  reducers: {
    setGuardians: (state, action: PayloadAction<Guardian[]>) => {
      state.guardians = action.payload
    },
    addGuardian: (state, action: PayloadAction<Guardian>) => {
      state.guardians.push(action.payload)
    },
    updateGuardian: (state, action: PayloadAction<Guardian>) => {
      const index = state.guardians.findIndex(g => g.id === action.payload.id)
      if (index !== -1) {
        state.guardians[index] = action.payload
      }
    },
    deleteGuardian: (state, action: PayloadAction<string>) => {
      state.guardians = state.guardians.filter(g => g.id !== action.payload)
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
  setGuardians, 
  addGuardian, 
  updateGuardian, 
  deleteGuardian, 
  setLoading, 
  setError 
} = guardianSlice.actions

export default guardianSlice.reducer