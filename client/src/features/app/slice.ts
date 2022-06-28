import { red } from '@mui/material/colors'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  AppUser,
  getPersistedAuthFromStorage,
  onLogin,
} from '../../shared/auth'
export interface AppNotification {
  id: string
  message: string
  closed?: boolean
}
export interface AppState {
  user?: AppUser
  token?: string
  darkTheme: boolean
  notifications: AppNotification[]
  drawerLeftOpen?: boolean
  drawerRightOpen?: boolean
  loading?: boolean
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const defaultState: AppState = {
  darkTheme: !!prefersDark,
  notifications: [],
}

const persistedToken = getPersistedAuthFromStorage()
const initialState = {
  ...defaultState,
  token: persistedToken?.token,
  user: persistedToken?.user,
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    patch: (state, action: PayloadAction<Partial<AppState>>) => {
      return { ...state, ...action.payload }
    },
    notify: (state, action: PayloadAction<AppNotification>) => {
      state.notifications.push(action.payload)
    },
  },
})

export const { patch } = slice.actions

export default slice.reducer
