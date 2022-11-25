import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PagedResult } from '../../../../lib/src/types'

export interface AdminState {
  activeMenuItem?: string
  menuOpen?: boolean
  loading?: boolean
  loaded?: boolean
  data: {
    [key: string]: PagedResult
  }
}

const initialState: AdminState = {
  data: {},
}

const slice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    patch: (state, action: PayloadAction<Partial<AdminState>>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { patch } = slice.actions

export const actions = slice.actions

export default slice.reducer
