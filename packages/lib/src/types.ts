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
  timer?: number
}

export interface Drawing {
  id?: string
  name: string
  history: DrawAction[]
  userId?: string
  createdAt?: Date
  updatedAt?: Date
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
