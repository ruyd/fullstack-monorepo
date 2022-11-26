/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyAction, createAsyncThunk, ThunkDispatch } from '@reduxjs/toolkit'
import { GridPatchProps, PagedResult } from '@shared/lib'
import { get } from '../app'
import { patch } from './slice'

export const loadDataAsync = createAsyncThunk(
  'admin/data/read',
  async (name: string, { dispatch, getState }) => {
    const response = await get<PagedResult>(`${name}`)
    dispatch(patch({ data: { [name]: { ...response.data } } }))
  },
)
