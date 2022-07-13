import { JwtPayload } from 'jsonwebtoken'
import { Attributes, Model, ModelAttributes } from 'sequelize/types'
export * from './drawing'

export interface AppAccessToken extends JwtPayload {
  userId: string
  roles: string[]
}

export const HotReloadTestVar: string = 'nice'

/**
 * Configuration Schema for DB Entities
 */
export interface ModelConfig<T = unknown> {
  name: string
  attributes: ModelAttributes<Model<T>, Attributes<Model<T>>>
  roles?: string[]
  paranoid?: boolean
}

/**
 * Static list of defined ModelConfigs on shared lib
 */
export const entities: ModelConfig[] = []

/**
 * Add Entity config to Server Sequelize entities
 * @cfg {ModelConfig} entity
 * @returns ModelConfig
 */
export const define = <T>(cfg: ModelConfig<T>): ModelConfig<T> => {
  entities.push(cfg)
  return cfg
}

/**
 * Common Model Options
 * ie: Timestamps
 */
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
