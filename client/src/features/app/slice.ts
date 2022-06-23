import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface AppNotification {
  id: string
  message: string
  closed?: boolean
}
export interface AppState {
  user?: any
  token?: string
  darkTheme: boolean
  notifications: AppNotification[]
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

const initialState: AppState = {
  darkTheme: !!prefersDark,
  notifications: [],
}
const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    patch: (state, action: PayloadAction<Partial<AppState>>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { patch } = slice.actions

export default slice.reducer
