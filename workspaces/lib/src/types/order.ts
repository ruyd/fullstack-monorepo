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
  id?: string
  orderId?: string
  drawingId?: string
  price?: number
  quantity?: number
  drawing?: Drawing
}

export interface Order extends Entity {
  id?: string
  userId?: string
  drawingId?: string
  price?: number
  status?: OrderStatus
  user?: User
  drawing?: Drawing
}
