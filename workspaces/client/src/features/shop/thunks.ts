/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Address, Cart, CheckoutRequest, Drawing, Order, PagedResult, PaymentMethod } from '@lib'
import { RootState } from '../../shared/store'
import { get, Method, notify, request } from '../app'
import { patch } from './slice'

export const intentAsync = createAsyncThunk(
  'shop/intent',
  async (payload: Record<string, unknown>, { dispatch }) => {
    const response = await request<{ intent: string }>('shop/intent', payload)
    dispatch(patch({ intent: response.data.intent }))
    return response.data?.intent
  },
)
export const loadAsync = createAsyncThunk('shop/load', async (_, { dispatch, getState }) => {
  const state = getState() as RootState
  const { data: cart } = await get<PagedResult<Cart>>('cart')
  const { data: orders } = await get<PagedResult<Order>>('order')
  const { data: address } = await get<PagedResult<Address>>('address')
  const { data: payment } = await get<PagedResult<PaymentMethod>>('payment_method')
  dispatch(patch({ addresses: address.items, loaded: true }))
  // dispatch(patch({ intent: response.data.intent }))
})

export const cartAsync = createAsyncThunk(
  'shop/cart',
  async ({ item, quantity }: { item: Drawing; quantity: number }, { dispatch, getState }) => {
    const state = getState() as RootState
    const method = quantity === 0 ? Method.DELETE : Method.POST
    const cart = { drawingId: item.drawingId, quantity } as Cart
    const existing = state.shop.items.find(i => i.drawingId === item.drawingId)
    if (existing) {
      cart.cartId = existing.cartId
      cart.quantity += existing.quantity
    }
    const response = await request<Cart>('cart', { ...cart }, method)
    const others = state.shop.items.filter(i => i.drawingId !== item.drawingId)
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

export const checkoutAsync = createAsyncThunk(
  'shop/checkout',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState
    const payload: CheckoutRequest = {
      items: state.shop.items,
      intent: state.shop.intent,
      shippingAddressId: state.shop.shippingAddressId,
      paymentMethodId: state.shop.paymentMethodId,
    }
    const response = await request<Order, CheckoutRequest>('shop/checkout', payload)
    dispatch(patch({ items: [], intent: undefined }))
    return response.data
  },
)
