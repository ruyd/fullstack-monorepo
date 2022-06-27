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
    login: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      onLogin(action.payload) //this should not work but testing it
    },
  },
})

export const { patch, login } = slice.actions

export default slice.reducer
