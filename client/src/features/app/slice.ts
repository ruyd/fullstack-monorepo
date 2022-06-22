import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppState {
  user?: any
  token?: string
  theme: string
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

const initialState: AppState = {
  theme: prefersDark ? 'dark' : 'light',
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

export default slice.reducer
