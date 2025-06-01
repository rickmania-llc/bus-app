import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Driver } from '../../../../common/types/Driver'

interface DriverWithId extends Driver {
  id: string
}

interface DriverState {
  drivers: DriverWithId[]
  loading: boolean
  error: string | null
}

const initialState: DriverState = {
  drivers: [],
  loading: false,
  error: null
}

const driverSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    setDrivers: (state, action: PayloadAction<DriverWithId[]>) => {
      state.drivers = action.payload
    },
    addDriver: (state, action: PayloadAction<DriverWithId>) => {
      state.drivers.push(action.payload)
    },
    updateDriver: (state, action: PayloadAction<DriverWithId>) => {
      const index = state.drivers.findIndex(d => d.id === action.payload.id)
      if (index !== -1) {
        state.drivers[index] = action.payload
      }
    },
    deleteDriver: (state, action: PayloadAction<string>) => {
      state.drivers = state.drivers.filter(d => d.id !== action.payload)
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
  setDrivers, 
  addDriver, 
  updateDriver, 
  deleteDriver, 
  setLoading, 
  setError 
} = driverSlice.actions

export default driverSlice.reducer