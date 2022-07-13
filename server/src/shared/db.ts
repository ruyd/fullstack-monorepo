import { Model, ModelOptions, ModelStatic, Sequelize } from 'sequelize'
import config from './config'

export const commonOptions: ModelOptions = {
  timestamps: true,
  underscored: true,
}

export interface ModelConfig {
  name: string
  attributes: { [key: string]: unknown }
  roles?: string[]
  options?: ModelOptions
}

export const models: ModelStatic<Model>[] = []

export const db = new Sequelize(config.db.url, {
  ssl: config.db.ssl,
}) as Sequelize & { apify: (cfg: ModelConfig) => void; entities: ModelConfig[] }

export const entities: ModelConfig[] = []

db.entities = entities

export function apify(cfg: ModelConfig): void {
  entities.push(cfg)
}

db.apify = apify

export default db
