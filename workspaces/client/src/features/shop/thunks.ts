import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  type Address,
  type Cart,
  type CheckoutRequest,
  type Order,
  type PagedResult,
  Subscription,
  Wallet,
  CheckoutResponse
} from '@lib'
import { type RootState } from '../../shared/store'
import { get, Method, notify, request } from '../app'
import { patch } from './slice'
import { type PaymentIntentResult } from '@stripe/stripe-js'

export const intentAsync = createAsyncThunk(
  'shop/intent',
  async (payload: Record<string, unknown>, {}) => {
    const response = await request<{ intent: string }>('shop/intent', payload)
    // dispatch(patch({ receipt: response.data.intent }))
    return response.data?.intent
  }
)
export const loadAsync = createAsyncThunk('shop/load', async (_, { dispatch }) => {
  const p1 = get<PagedResult<Cart>>('cart?include=drawing,product').then(({ data }) =>
    dispatch(patch({ items: data.items }))
  )
  const p2 = await get<PagedResult<Order>>('order').then(({ data }) =>
    dispatch(patch({ orders: data.items }))
  )
  const p3 = await get<PagedResult<Address>>('address').then(({ data }) =>
    dispatch(patch({ addresses: data.items }))
  )
  const p4 = await get<PagedResult<Wallet>>('wallet').then(({ data }) =>
    dispatch(patch({ wallet: data.items?.at(0) }))
  )
  const p5 = await get<PagedResult<Subscription>>('subscription?include=order').then(({ data }) =>
    dispatch(
      patch({
        subscriptions: data.items,
        activeSubscription: data.items?.find(s => s.status === 'active')
      })
    )
  )

  await Promise.all([p1, p2, p3, p4, p5]).then(() => dispatch(patch({ loaded: true })))
})

export const cartAsync = createAsyncThunk(
  'shop/cart',
  async ({ drawing, product, quantity, ...item }: Partial<Cart>, { dispatch, getState }) => {
    const state = getState() as RootState
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
      cart.quantity = quantity ? existing.quantity + quantity : undefined
    }
    const method = !cart.quantity || cart.quantity < 1 ? Method.DELETE : Method.POST
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

/**
 * Subscriptions are a bit different from regular cart items.
 * You cannot buy different ones at the same time.
 */
export const subscribeAsync = createAsyncThunk(
  'shop/subscribe',
  async ({ product, quantity, ...item }: Partial<Cart>, { dispatch, getState }) => {
    const state = getState() as RootState
    const cart: Partial<Cart> = {
      ...item,
      productId: product?.productId,
      priceId: product?.id,
      quantity,
      cartType: 'subscription'
    }
    const existing = state.shop.items.find(
      i => i.cartId === item.cartId || i.priceId === product?.id
    )
    if (existing != null) {
      cart.cartId = existing.cartId
      cart.quantity = quantity ? existing.quantity + quantity : undefined
    }

    const response = await request<Cart>('shop/subscribe', { ...cart }, Method.POST)
    const name = product?.title
    const price = product?.amount
    const others = state.shop.items.filter(
      i => i.cartId !== cart.cartId && i.cartType !== 'subscription'
    )

    const fromServer = { ...response.data, product }
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
    const response = await request<CheckoutResponse, CheckoutRequest>('shop/checkout', checkout)
    const orders = [...state.shop.orders, response.data.order]
    const activeSubscription =
      (response.data.order.subscription as Subscription) || state.shop.activeSubscription
    const subscriptions = [
      ...(state.shop.subscriptions?.filter(
        s => s.subscriptionId !== activeSubscription.subscriptionId
      ) || []),
      activeSubscription
    ]
    const wallet = response.data.wallet
    const activeStep = state.shop.activeStep + 1
    dispatch(
      patch({
        items: [],
        orders,
        receipt: response.data.order,
        activeStep,
        steps: { receipt: true },
        activeSubscription,
        subscriptions,
        wallet
      })
    )
    return response.data
  }
)

export const cancelSubscriptionAsync = createAsyncThunk(
  'shop/subscription/cancel',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState

    const payload = {
      ...state.shop.activeSubscription,
      status: 'canceled',
      canceledAt: new Date(),
      cancelationReason: 'user manually'
    }
    const response = await request<boolean | { error: string }>('subscription', payload)
    if (response.status === 200) {
      dispatch(notify(`Cancelled subscription ${state.shop.activeSubscription?.title}`))
      dispatch(patch({ activeSubscription: undefined }))
    } else {
      dispatch(notify(`Failed to cancel subscription ${state.shop.activeSubscription?.title}`))
    }
  }
)
