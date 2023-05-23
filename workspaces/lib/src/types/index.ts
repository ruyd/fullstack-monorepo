import { Order } from './order'
import { Wallet } from './wallet'

export * from './cart'
export * from './drawing'
export * from './order'
export * from './setting'
export * from './user'
export * from './subscription'
export * from './product'
export * from './wallet'
export * from './auth'

/**
 * Common Model Options
 * ie: Timestamps
 */
export interface Entity {
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export interface PagedResult<T = { [key: string]: string | number }> {
  items?: T[]
  offset: number
  limit: number
  hasMore: boolean
  total: number
}

export interface GridPatchProps {
  id: string | number
  field: string
  value: unknown
}

export interface CheckoutRequest {
  ids: { cartId?: string; productId?: string; drawingId?: string }[]
  intent?: { amount: number; currency: string }
  confirmation?: string
  shippingAddressId?: string
  paymentSource?: string
}

export interface CheckoutResponse {
  order: Order
  error: string
  wallet?: Wallet
}
