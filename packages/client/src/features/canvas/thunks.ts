import { createAsyncThunk } from '@reduxjs/toolkit'
import { DrawAction } from '@root/lib'
import { RootState } from '../../shared/store'
import { request } from '../app/thunks'

export const loadAsync = createAsyncThunk(
  'canvas/load',
  async (payload: string, { dispatch }) => {
    const response = await request(dispatch, `/drawing/${payload}`, null, 'get')
    return response.data
  }
)

export const saveAsync = createAsyncThunk(
  'canvas/save',
  async (history: DrawAction[], { dispatch, getState }) => {
    const state = getState() as RootState
    const payload = state.canvas.current
    payload.history = history
    await request(dispatch, '/drawing', payload)
  }
)
