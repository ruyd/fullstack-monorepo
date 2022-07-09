import { JwtPayload } from 'jsonwebtoken'

export interface AppAccessToken extends JwtPayload {
  userId: string
  roles: string[]
}

export interface DrawAction {
  x: number
  y: number
  color?: string
  size?: number
  style?: string
  time?: number
  open?: boolean
}

export interface Drawing {
  id?: string
  name: string
  history: DrawAction[]
  userId?: string
  createdAt?: Date
  updatedAt?: Date
}

export const Testy: string = 'hotness'
/**
 * worth it? too much typing?xx
 */
export class AppDrawing implements Partial<Drawing> {
  history: DrawAction[]
  constructor() {
    this.history = []
  }
  calcDuration() {
    const total = this.history.reduce(
      (acc: number, cur: DrawAction) => (cur?.time || 0) + acc,
      0
    )
    return total
  }
}

export interface User {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  picture?: string
  createdAt?: Date
  updatedAt?: Date
}
