import { createAsyncThunk } from '@reduxjs/toolkit'
import { Cart, Drawing } from '@shared/lib'
import { RootState } from 'src/shared/store'
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
  async ({ item, quantity }: { item: Drawing; quantity: number }, { dispatch, getState }) => {
    const state = getState() as RootState
    const method = quantity === 0 ? Method.DELETE : Method.POST
    const response = await request<Cart>('cart', { id: item.id, quantity }, method)
    if (method === Method.DELETE) {
      dispatch(notify(`Removed ${response.data?.drawing?.name}`))
      dispatch(patch({ items: state.shop.items.filter(i => i.drawingId !== item.id) }))

      return response.data
    }
    dispatch(patch({ items: [...state.shop.items, response.data] }))
    dispatch(notify(`Added ${response.data?.drawing?.name} ${response.data?.drawing?.price}`))
    return response.data
  },
)
