import { JwtPayload } from 'jsonwebtoken'
import { Attributes, Model, ModelAttributes } from 'sequelize/types'
export * from './drawing'

export interface AppAccessToken extends JwtPayload {
  userId: string
  roles: string[]
}

export const HotReloadTestVar: string = 'nice'

export interface Entity {
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export interface User extends Entity {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  picture?: string
}
