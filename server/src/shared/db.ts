import {
  Attributes,
  Model,
  ModelAttributes,
  ModelOptions,
  ModelStatic,
  Sequelize,
} from 'sequelize'
import config from './config'

export const commonOptions: ModelOptions = {
  timestamps: true,
  underscored: true,
}

export interface ModelConfig<M extends Model = Model> {
  name: string
  attributes: ModelAttributes<M, Attributes<M>>
  roles?: string[]
  unsecureRead?: boolean
  unsecure?: boolean
}

//Instance
export const models: ModelStatic<Model>[] = []
export const entities: ModelConfig[] = []
export const db = new Sequelize(config.db.url, {
  ssl: config.db.ssl,
})

export function register<T>(
  name: string,
  attributes: ModelAttributes<Model<T>, Attributes<Model<T>>>,
  unsecureRead?: boolean,
  roles?: string[]
): ModelStatic<Model<T, T>> {
  const cfg = {
    name,
    attributes,
    unsecureRead,
    roles,
  }
  entities.push(cfg)
  const model = db.define<Model<T>>(cfg.name, cfg.attributes, commonOptions)
  const existing = models.find((m) => m.name === model.name)
  if (!existing) {
    models.push(model)
  }
  return model
}

export default db
