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
    const cart = { drawingId: item.id, quantity } as Cart
    const existing = state.shop.items.find(i => i.drawingId === item.id)
    if (existing) {
      cart.cartId = existing.cartId
      cart.quantity += existing.quantity
    }
    const response = await request<Cart>('cart', { ...cart }, method)
    const others = state.shop.items.filter(i => i.drawingId !== item.id)
    if (method === Method.DELETE) {
      dispatch(notify(`Removed ${item?.name}`))
      dispatch(patch({ items: others }))
      return response.data
    }

    const fromServer = { ...response.data, drawing: item }
    dispatch(patch({ items: [...others, fromServer] }))
    dispatch(notify(`Added ${item.name} ${item.price}`))
    return response.data
  },
)
