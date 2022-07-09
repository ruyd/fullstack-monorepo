import { createAsyncThunk } from '@reduxjs/toolkit'
import { DrawAction } from '@root/lib'
import { RootState } from '../../shared/store'
import { request } from '../app/thunks'
import { actions } from './slice'

export const loadAsync = createAsyncThunk(
  'canvas/load',
  async (_, { dispatch }) => {
    const response = await request(dispatch, `/drawing`, null, 'get')
    if (response.status === 200) {
      dispatch(actions.patch({ items: response.data }))
    }
    return response.data
  }
)

export const saveAsync = createAsyncThunk(
  'canvas/save',
  async (history: DrawAction[], { dispatch, getState }) => {
    const state = getState() as RootState
    const payload = { ...state.canvas.current, history }
    const response = await request(dispatch, '/drawing', payload)
    if (response.status === 200) {
      dispatch(actions.onSave(response.data))
    }
    return response.data
  }
)
