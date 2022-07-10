import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DrawAction, Drawing } from '@root/lib'

export interface CanvasState {
  current: Drawing
  items: Drawing[]
  loaded?: boolean
  loading?: boolean
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
      state.current.id = action.payload.id
      state.current.updatedAt = action.payload.updatedAt
      state.current.createdAt = action.payload.createdAt
      const existing = state.items.find((item) => item.id === action.payload.id)
      if (existing) {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        )
      } else {
        state.items.push(action.payload)
      }
    },
  },
})

export const actions = canvasSlice.actions

export default canvasSlice.reducer
