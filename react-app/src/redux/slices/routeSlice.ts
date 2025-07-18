import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { Route, Location, EmbeddedStop, StudentStatus } from '../../types/models/Route'

interface RouteState {
  routes: Route[]
  loading: boolean
  error: string | null
}

const initialState: RouteState = {
  routes: [],
  loading: false,
  error: null
}

const routeSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    setRoutes: (state, action: PayloadAction<Route[]>) => {
      state.routes = action.payload
    },
    addRoute: (state, action: PayloadAction<Route>) => {
      state.routes.push(action.payload)
    },
    updateRoute: (state, action: PayloadAction<Route>) => {
      const index = state.routes.findIndex(r => r.id === action.payload.id)
      if (index !== -1) {
        state.routes[index] = action.payload
      }
    },
    deleteRoute: (state, action: PayloadAction<string>) => {
      state.routes = state.routes.filter(r => r.id !== action.payload)
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
  setRoutes, 
  addRoute, 
  updateRoute, 
  deleteRoute, 
  setLoading, 
  setError 
} = routeSlice.actions

export default routeSlice.reducer