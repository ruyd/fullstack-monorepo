import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'
import { AppThunk } from '../../shared/store'

export interface CanvasBit {
  x: number
  y: number
  color?: string
  size?: number
  style?: string
}

export interface CanvasState {
  id: string
  name: string
  history: CanvasBit[]
  items: []
}

const initialState: CanvasState = {
  id: uuid(),
  name: 'New Draft',
  history: [],
  items: [],
}

export const counterSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    onChange: (state, action: PayloadAction<CanvasBit>) => {
      state.history.push(action.payload)
    },
  },
})

export const actions = counterSlice.actions

export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {}

export default counterSlice.reducer
