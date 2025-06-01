import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type ViewType = 'Dashboard' | 'Routes' | 'Students' | 'Drivers'

interface AppState {
  currentView: ViewType
  selectedItemId: string | null
  isRightPanelVisible: boolean
  isInfoPanelVisible: boolean
}

const initialState: AppState = {
  currentView: 'Dashboard',
  selectedItemId: null,
  isRightPanelVisible: false,
  isInfoPanelVisible: false
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<ViewType>) => {
      state.currentView = action.payload
      state.selectedItemId = null
      state.isRightPanelVisible = false
      state.isInfoPanelVisible = false
    },
    setSelectedItemId: (state, action: PayloadAction<string | null>) => {
      state.selectedItemId = action.payload
    },
    toggleRightPanel: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.isRightPanelVisible = action.payload
      } else {
        state.isRightPanelVisible = !state.isRightPanelVisible
      }
    },
    toggleInfoPanel: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.isInfoPanelVisible = action.payload
      } else {
        state.isInfoPanelVisible = !state.isInfoPanelVisible
      }
    }
  }
})

export const { 
  setView, 
  setSelectedItemId, 
  toggleRightPanel, 
  toggleInfoPanel 
} = appSlice.actions

export default appSlice.reducer