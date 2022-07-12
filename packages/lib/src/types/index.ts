import { JwtPayload } from 'jsonwebtoken'
import { Attributes, DataTypes, Model, ModelAttributes } from 'sequelize/types'
export * from './drawing'

export interface AppAccessToken extends JwtPayload {
  userId: string
  roles: string[]
}

export const HotReloadTestVar: string = 'nice'

/**
 * Configuration Schema for DB Entities
 */
export interface ModelConfig {
  name: string
  attributes: ModelAttributes<Model, Partial<Attributes<Model>>>
  roles?: string[]
  paranoid?: boolean
}

/**
 * Static list of defined ModelConfigs on shared lib
 */
export const entities: ModelConfig[] = []

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
