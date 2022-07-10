import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Drawing } from '@root/lib'

export interface CanvasState {
  active: Drawing
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

const active = getDraft()

const initialState: CanvasState = {
  active,
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
      state.active.id = action.payload.id
      state.active.updatedAt = action.payload.updatedAt
      state.active.createdAt = action.payload.createdAt
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
