import { createAsyncThunk } from '@reduxjs/toolkit'
import { Drawing } from '@root/lib'
import { RootState } from '../../shared/store'
import { get, Method, request } from '../app/thunks'
import { getCopy, getDraft } from './helpers'
import { actions } from './slice'

export const itemsAsync = createAsyncThunk(
  'canvas/list',
  async (_, { dispatch }) => {
    const resp = await get<Drawing[]>(`/drawing`)
    if (resp.status === 200) {
      dispatch(actions.patch({ items: resp.data }))
    }
    return resp.data
  }
)

export const getAsync = createAsyncThunk(
  'canvas/get',
  async (id: string, { dispatch, getState }) => {
    const resp = await get<Drawing>(`/drawing/${id}`)
    let active = resp.data
    if (resp.status === 200) {
      const userId = (getState() as RootState).app.user?.userId
      if (resp.data.userId !== userId) {
        active = getCopy(resp.data)
      }
      dispatch(actions.patch({ active }))
    }
    return active
  }
)

export const saveAsync = createAsyncThunk(
  'canvas/save',
  async ({ history, thumbnail }: Partial<Drawing>, { dispatch, getState }) => {
    const state = getState() as RootState
    const payload = {
      ...state.canvas.active,
      history,
      thumbnail,
    }

    if (['draft', 'edit'].includes(payload.id as string)) {
      payload.id = undefined
    }

    const response = await request<Drawing>('/drawing', payload)
    if (response.status === 200) {
      dispatch(actions.onSave(response.data))
    }
    return response.data
  }
)

export const deleteAsync = createAsyncThunk(
  'canvas/delete',
  async (id: string, { dispatch, getState }) => {
    const response = await request(`/drawing/${id}`, null, Method.DELETE)
    if (response.status !== 200) {
      return
    }
    const state = (getState() as RootState).canvas.items
    const items = state.filter((item) => item.id !== id)
    const active = items.find((item) => item.id === id) || getDraft()
    dispatch(actions.patch({ items, active }))
  }
)
