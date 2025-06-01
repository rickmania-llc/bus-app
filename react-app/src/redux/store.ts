import { configureStore } from '@reduxjs/toolkit'
import studentReducer from './slices/studentSlice'
import guardianReducer from './slices/guardianSlice'
import appReducer from './slices/appSlice'
import driverReducer from './slices/driverSlice'
import routeReducer from './slices/routeSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    students: studentReducer,
    guardians: guardianReducer,
    drivers: driverReducer,
    routes: routeReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch