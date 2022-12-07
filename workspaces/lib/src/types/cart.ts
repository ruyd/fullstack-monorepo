import { Drawing } from './drawing'

export interface Cart {
  userId: string
  drawingId: string
  quantity: number
  drawing?: Drawing
}
