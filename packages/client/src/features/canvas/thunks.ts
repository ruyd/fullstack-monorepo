import { createAsyncThunk } from '@reduxjs/toolkit'
import { DrawAction, Drawing } from '@root/lib'
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
  async (
    { history, name }: { history: DrawAction[]; name?: string },
    { dispatch, getState }
  ) => {
    const state = getState() as RootState
    const payload: Drawing = { ...state.canvas.active, history }
    if (name) {
      payload.name = name
    }
    const response = await request(dispatch, '/drawing', payload)
    if (response.status === 200) {
      dispatch(actions.onSave(response.data))
    }
    return response.data
  }
)
