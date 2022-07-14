import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Drawing } from '@root/lib'

export interface GalleryState {
  items: Drawing[]
  loading?: boolean
}

const initialState: GalleryState = {
  items: [],
}

export const slice = createSlice({
  name: 'gallery',
  initialState: initialState,
  reducers: {
    patch: (state, action: PayloadAction<Partial<GalleryState>>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const actions = slice.actions

export default slice.reducer
