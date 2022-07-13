import { Model, ModelOptions, ModelStatic, Sequelize } from 'sequelize'
import config from './config'

export const commonOptions: ModelOptions = {
  timestamps: true,
  underscored: true,
}

export const db = new Sequelize(config.db.url, {
  ssl: config.db.ssl,
})

export const models: ModelStatic<Model>[] = []

export default db
