import { createAsyncThunk } from '@reduxjs/toolkit'
import { Method, notify, request } from '../app'
import { patch } from './slice'

export const intentAsync = createAsyncThunk(
  'shop/intent',
  async (payload: Record<string, unknown>, { dispatch }) => {
    const response = await request<{ intent: string }>('shop/intent', payload)
    dispatch(patch({ intent: response.data.intent }))
    return response.data?.intent
  },
)

export const cartAsync = createAsyncThunk(
  'shop/cart',
  async (payload: Record<string, unknown>, { dispatch }) => {
    const response = await request<{ intent: string }>('cart', payload, Method.PATCH)
    dispatch(notify(`Added ${payload.name}`))
    return response.data?.intent
  },
)
