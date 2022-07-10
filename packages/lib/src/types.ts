import { JwtPayload } from 'jsonwebtoken'

export interface AppAccessToken extends JwtPayload {
  userId: string
  roles: string[]
}

export enum ActionType {
  Open = 'o',
  Close = 'c',
  Stroke = 's',
}

export interface DrawAction {
  t: ActionType
  x?: number
  y?: number
  c?: string
  w?: number
  st?: string
  ts?: number
}

export interface Drawing {
  id?: string
  userId?: string
  name: string
  history: DrawAction[]
  thumbnail?: string
  createdAt?: Date
  updatedAt?: Date
}

export const Testy: string = 'verynice'
/**
 * worth it? too much hassle for this pattern?
 */
export class AppDrawing implements Partial<Drawing> {
  history: DrawAction[]
  constructor() {
    this.history = []
  }
  calcDuration() {
    const total = this.history.reduce(
      (acc: number, cur: DrawAction) => (cur?.ts || 0) + acc,
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
