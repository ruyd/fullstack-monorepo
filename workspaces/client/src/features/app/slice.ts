import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppUser, getPersistedAuthFromStorage } from '../../shared/auth'
import { ThemeState } from '../ui/Theme/getTheme'
import { AppNotification, NotificationSeverity } from './types'

export interface AppState {
  user?: AppUser
  token?: string
  darkMode: boolean
  ui?: ThemeState
  notifications: AppNotification[]
  drawerLeftOpen?: boolean
  drawerRightOpen?: boolean
  loading?: boolean
  loaded?: boolean
  dialog?: string
  enableLogin?: boolean
  enableRegistration?: boolean
  deviceId?: string
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const defaultState: AppState = {
  darkMode: !!prefersDark,
  notifications: [],
}

const persistedAuth = getPersistedAuthFromStorage()
const initialState = {
  ...defaultState,
  token: persistedAuth?.token,
  user: persistedAuth?.user,
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    patch: (state, action: PayloadAction<Partial<AppState>>) => {
      return { ...state, ...action.payload }
    },
    notify: (state, action: PayloadAction<string>) => {
      state.notifications.push({
        message: action.payload,
        id: new Date().getTime().toString(),
        severity: NotificationSeverity.info,
      })
    },
    notifyError: (state, action: PayloadAction<string>) => {
      state.notifications.push({
        message: action.payload,
        id: new Date().getTime().toString(),
        severity: NotificationSeverity.error,
      })
    },
  },
})

export const { patch, notify, notifyError } = slice.actions

export default slice.reducer
