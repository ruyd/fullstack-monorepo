import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Drawing } from '@root/lib'
import { getDraft } from './helpers'

export interface Brush {
  size: number
  color?: string
  style?: string
}

export interface CanvasState {
  active: Drawing
  items: Drawing[]
  loaded?: boolean
  loading?: boolean
  brush?: Brush
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
    patchActive: (state, action: PayloadAction<Partial<Drawing>>) => {
      return { ...state, active: { ...state.active, ...action.payload } }
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
