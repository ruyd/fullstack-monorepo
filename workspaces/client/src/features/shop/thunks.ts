/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  type Address,
  type Cart,
  type CheckoutRequest,
  type Drawing,
  type Order,
  type PagedResult,
  PaymentMethod,
  type Product,
  Price
} from '@lib'
import { type RootState } from '../../shared/store'
import { get, Method, notify, request } from '../app'
import { patch } from './slice'
import { type PaymentIntentResult } from '@stripe/stripe-js'

export const intentAsync = createAsyncThunk(
  'shop/intent',
  async (payload: Record<string, unknown>, { dispatch }) => {
    const response = await request<{ intent: string }>('shop/intent', payload)
    // dispatch(patch({ receipt: response.data.intent }))
    return response.data?.intent
  }
)
export const loadAsync = createAsyncThunk('shop/load', async (_, { dispatch, getState }) => {
  const state = getState() as RootState
  const { data: cart } = await get<PagedResult<Cart>>('cart?include=drawing,product')
  const { data: orders } = await get<PagedResult<Order>>('order')
  const { data: address } = await get<PagedResult<Address>>('address')

  dispatch(
    patch({ items: cart.items, addresses: address.items, orders: orders.items, loaded: true })
  )
})

export const cartAsync = createAsyncThunk(
  'shop/cart',
  async ({ drawing, product, quantity, ...item }: Partial<Cart>, { dispatch, getState }) => {
    const state = getState() as RootState
    const method = quantity && quantity < 1 ? Method.DELETE : Method.POST
    const cart: Partial<Cart> = {
      ...item,
      drawingId: drawing?.drawingId,
      productId: product?.productId,
      priceId: product?.id,
      quantity
    }
    const existing = state.shop.items.find(
      i =>
        i.cartId === item.cartId || i.priceId === product?.id || i.drawingId === drawing?.drawingId
    )
    if (existing != null) {
      cart.cartId = existing.cartId
      cart.quantity = existing.quantity + (quantity ?? 0)
    }
    const response = await request<Cart>(
      'cart',
      method === Method.DELETE ? { ids: [cart.cartId] } : { ...cart },
      method
    )
    const name = drawing?.name ?? product?.title
    const price = drawing?.price ?? product?.amount
    const others = state.shop.items.filter(i => i.cartId !== cart.cartId)
    if (method === Method.DELETE) {
      dispatch(notify(`Removed ${name}`))
      dispatch(patch({ items: others }))
      return response.data
    }

    const fromServer = { ...response.data, drawing, product }
    dispatch(patch({ items: [...others, fromServer] }))
    dispatch(notify(`Added ${name} ${price}`))
    return response.data
  }
)

export const checkoutAsync = createAsyncThunk(
  'shop/checkout',
  async (payload: PaymentIntentResult, { dispatch, getState }) => {
    const state = getState() as RootState
    const checkout: CheckoutRequest = {
      ids: state.shop.items.map(i => ({
        cartId: i.cartId,
        drawingId: i.drawingId,
        productId: i.productId,
        priceId: i.priceId
      })),
      intent: payload.paymentIntent,
      shippingAddressId: state.shop.shippingAddressId
    }
    const response = await request<Order, CheckoutRequest>('shop/checkout', checkout)
    const orders = [...state.shop.orders, response.data]
    const activeStep = state.shop.activeStep + 1
    dispatch(
      patch({ items: [], orders, receipt: response.data, activeStep, steps: { receipt: true } })
    )
    return response.data
  }
)
