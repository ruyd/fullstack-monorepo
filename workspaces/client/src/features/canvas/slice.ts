import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Drawing } from '@shared/lib'
import { getDraft } from './helpers'

export interface CanvasState {
  active: Drawing
  items: Drawing[]
  loaded?: boolean
  loading?: boolean
  size?: number
  color?: string
  style?: string
  showDetails?: boolean
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
      state.active = action.payload
      const existing = state.items.find(item => item.drawingId === action.payload.drawingId)
      if (existing) {
        state.items = state.items.map(item =>
          item.drawingId === action.payload.drawingId ? action.payload : item,
        )
      } else {
        state.items.push(action.payload)
      }
    },
  },
})

export const { patch } = canvasSlice.actions

export const actions = canvasSlice.actions

export default canvasSlice.reducer
