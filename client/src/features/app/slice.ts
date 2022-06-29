import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppUser, getPersistedAuthFromStorage } from '../../shared/auth'

export enum NotificationType {
  info = 'info',
  success = 'success',
  error = 'error',
}
export interface AppNotification {
  id: string
  message: string
  type?: NotificationType
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
    notify: (state, action: PayloadAction<string>) => {
      state.notifications.push({
        message: action.payload,
        id: new Date().getTime().toString(),
        type: NotificationType.info,
      })
    },
    notifyError: (state, action: PayloadAction<string>) => {
      state.notifications.push({
        message: action.payload,
        id: new Date().getTime().toString(),
        type: NotificationType.error,
      })
    },
  },
})

export const { patch, notify, notifyError } = slice.actions

export default slice.reducer
