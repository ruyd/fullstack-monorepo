import { createAsyncThunk } from '@reduxjs/toolkit'
import { actions } from './slice'
import { Method, request } from '../app/thunks'
import { Drawing } from '@root/lib'

export const loadAsync = createAsyncThunk(
  'gallery/load',
  async (_, { dispatch }) => {
    const resp = await request<Drawing[]>(dispatch, '/drawings', {}, Method.GET)
    const items = resp.data
    dispatch(actions.patch({ items }))
  }
)
