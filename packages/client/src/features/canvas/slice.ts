import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DrawAction, Drawing } from '@root/lib'
import { AppThunk } from '../../shared/store'

export interface CanvasState {
  current: Drawing
  items: Drawing[]
}

function getDraft() {
  let draft: Drawing = {
    id: '',
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
    onChange: (state, action: PayloadAction<DrawAction>) => {
      state.current.history.push(action.payload)
    },
  },
})

export const actions = canvasSlice.actions

export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {}

export default canvasSlice.reducer
