import { Entity, User } from '.'
import { Drawing } from './drawing'

export enum OrderStatus {
  Pending = 0,
  Paid = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4,
}

export interface OrderItem extends Entity {
  orderItemId?: string
  orderId?: string
  drawingId?: string
  price?: number
  quantity?: number
  drawing?: Drawing
}

export interface Order extends Entity {
  orderId?: string
  userId?: string

  total?: number
  status?: OrderStatus
  items?: OrderItem[]
  //
  user?: User
}

export interface Payment extends Entity {
  paymentId: string
  userId: string
  orderId: string
  amount: number
  currency: string
  status?: string
}

export enum PaymentSource {
  Stripe = 'STRIPE',
  PayPal = 'PAYPAL',
}

export enum PaymentStatus {
  Successful = 'COMPLETED',
  Pending = 'PENDING',
  Failed = 'FAILED',
  Created = 'CREATED',
}

export const StripeToPaymentStatusMap = {
  canceled: PaymentStatus.Failed,
  succeeded: PaymentStatus.Successful,
  processing: PaymentStatus.Pending,
  requires_action: PaymentStatus.Pending,
  requires_capture: PaymentStatus.Pending,
  requires_confirmation: PaymentStatus.Pending,
  requires_payment_method: PaymentStatus.Pending,
  unknown: PaymentStatus.Failed,
}
