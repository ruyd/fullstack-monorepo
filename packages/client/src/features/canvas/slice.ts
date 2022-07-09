import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DrawAction, Drawing } from '@root/lib'

export interface CanvasState {
  current: Drawing
  items: Drawing[]
}

function getDraft() {
  let draft: Drawing = {
    name: 'New Draft',
    history: [],
  }
  const persisted = localStorage.getItem('canvas')
  if (persisted?.includes('{')) {
    draft = JSON.parse(persisted) as Drawing
  }
  return draft
}

const current = getDraft()

const initialState: CanvasState = {
  current,
  items: [],
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    patch: (state, action: PayloadAction<Partial<CanvasState>>) => {
      return { ...state, ...action.payload }
    },
    onSave: (state, action: PayloadAction<Drawing>) => {
      state.current = action.payload
    },
  },
})

export const actions = canvasSlice.actions

export default canvasSlice.reducer
