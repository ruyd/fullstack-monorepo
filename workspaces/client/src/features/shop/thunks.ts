/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Address, Cart, CheckoutRequest, Drawing, Order, PagedResult, PaymentMethod } from '@lib'
import { RootState } from '../../shared/store'
import { get, Method, notify, request } from '../app'
import { patch } from './slice'
import { PaymentIntentResult } from '@stripe/stripe-js'

export const intentAsync = createAsyncThunk(
  'shop/intent',
  async (payload: Record<string, unknown>, { dispatch }) => {
    const response = await request<{ intent: string }>('shop/intent', payload)
    // dispatch(patch({ receipt: response.data.intent }))
    return response.data?.intent
  },
)
export const loadAsync = createAsyncThunk('shop/load', async (_, { dispatch, getState }) => {
  const state = getState() as RootState
  const { data: cart } = await get<PagedResult<Cart>>('cart?include=drawing')
  const { data: orders } = await get<PagedResult<Order>>('order')
  const { data: address } = await get<PagedResult<Address>>('address')
  dispatch(
    patch({ items: cart.items, addresses: address.items, orders: orders.items, loaded: true }),
  )
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
    const response = await request<Cart>(
      'cart',
      method === Method.DELETE ? { ids: [cart.cartId] } : { ...cart },
      method,
    )
    const others = state.shop.items.filter(i => i.cartId !== cart.cartId)
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
  async (payload: PaymentIntentResult, { dispatch, getState }) => {
    const state = getState() as RootState
    const checkout: CheckoutRequest = {
      ids: state.shop.items.map(i => [i.cartId, i.drawingId]),
      intent: payload.paymentIntent,
      shippingAddressId: state.shop.shippingAddressId,
    }
    const response = await request<Order, CheckoutRequest>('shop/checkout', checkout)
    const orders = [...(state.shop.orders || []), response.data]
    const activeStep = state.shop.activeStep + 1
    dispatch(
      patch({ items: [], orders, receipt: response.data, activeStep, steps: { receipt: true } }),
    )
    return response.data
  },
)
