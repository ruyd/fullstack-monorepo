import { JwtPayload } from 'jsonwebtoken'

export interface AppAccessToken extends JwtPayload {
  userId: string
  roles: string[]
}

export interface Drawing {
  id: number
  userId: string
  name: string
  data?: string
  history?: string[]
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
