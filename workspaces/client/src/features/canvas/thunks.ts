import { createAsyncThunk } from '@reduxjs/toolkit'
import { Drawing, PagedResult } from '@shared/lib'
import { RootState } from '../../shared/store'
import { notify, notifyError } from '../app'
import { get, Method, request } from '../app/thunks'
import { getCopy, getDraft } from './helpers'
import { actions } from './slice'

export const itemsAsync = createAsyncThunk('canvas/list', async (_, { dispatch }) => {
  const resp = await get<PagedResult<Drawing>>(`/drawing`)
  if (resp.status === 200) {
    dispatch(actions.patch({ items: resp.data.items, loaded: true }))
  }
  return resp.data
})

export const getAsync = createAsyncThunk(
  'canvas/get',
  async (id: string, { dispatch, getState }) => {
    let active: Drawing | undefined
    const state = getState() as RootState
    const userId = state.app.user?.userId
    active = state.canvas.items.find(i => i.drawingId === id)
    if (!active) {
      const resp = await get<Drawing>(`/drawing/${id}`)
      if (resp.status === 404) {
        dispatch(notifyError(`Drawing ${id} not found`))
      }
      const item = resp.data || getDraft()
      const own = item.userId === userId
      active = own ? item : getCopy(item)
    }
    dispatch(actions.patchActive(active as Drawing))
    return active
  },
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

    if (['draft', 'copy'].includes(payload.drawingId as string)) {
      payload.drawingId = undefined
    }

    const response = await request<Drawing>('/drawing', payload)
    if (response.status === 200) {
      dispatch(actions.onSave(response.data))
      dispatch(notify('Saved, scroll down to see'))
    }
    return response.data
  },
)

export const deleteAsync = createAsyncThunk(
  'canvas/delete',
  async (id: string, { dispatch, getState }) => {
    const response = await request(`/drawing/${id}`, null, Method.DELETE)
    if (response.status !== 200) {
      return
    }
    const state = (getState() as RootState).canvas.items
    const items = state.filter(item => item.drawingId !== id)
    const active = items.find(item => item.drawingId === id) || getDraft()
    dispatch(actions.patch({ items, active }))
  },
)
