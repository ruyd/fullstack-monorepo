import { createAsyncThunk } from '@reduxjs/toolkit'
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
  async (image: string, { dispatch, getState }) => {
    const state = getState() as RootState
    const response = await request(dispatch, '/drawing', {
      id: state.canvas.id,
      name: state.canvas.name,
      history: state.canvas.history,
    })
    return response.data
  }
)
