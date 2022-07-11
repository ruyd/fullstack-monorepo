import { JwtPayload } from 'jsonwebtoken'

export interface AppAccessToken extends JwtPayload {
  userId: string
  roles: string[]
}

export interface Entity {
  createdAt?: Date
  updatedAt?: Date
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

export interface Drawing extends Entity {
  id?: string
  userId?: string
  name: string
  history: DrawAction[]
  thumbnail?: string
}

export const HotReloadTestVar: string = 'nice'

/**
 * @deprecated
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

export interface User extends Entity {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  picture?: string
}
