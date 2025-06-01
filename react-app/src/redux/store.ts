import { configureStore } from '@reduxjs/toolkit'
import studentReducer from './slices/studentSlice'
import guardianReducer from './slices/guardianSlice'

export const store = configureStore({
  reducer: {
    students: studentReducer,
    guardians: guardianReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch