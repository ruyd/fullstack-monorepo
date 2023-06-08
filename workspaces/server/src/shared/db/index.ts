import {
  Attributes,
  InitOptions,
  Model,
  ModelAttributeColumnOptions,
  ModelAttributes,
  ModelOptions,
  ModelStatic,
  Sequelize
} from 'sequelize'
import { config } from '../config'
import logger from '../logger'
import { initModels, sortEntities } from './util'

export const commonOptions: ModelOptions = {
  timestamps: true,
  underscored: true
}
export interface Join {
  type: 'belongsTo' | 'hasOne' | 'hasMany' | 'belongsToMany'
  target: ModelStatic<Model>
  as?: string
  foreignKey?: string
  otherKey?: string
  through?: ModelStatic<Model> | string
}

export type EntityDefinition<T extends object> = {
  [key in keyof T]: ModelAttributeColumnOptions<Model<T>>
}

export interface EntityConfig<M extends Model = Model> {
  name: string
  attributes: ModelAttributes<M, Attributes<M>>
  roles?: string[]
  publicRead?: boolean
  publicWrite?: boolean
  model?: ModelStatic<M>
  joins?: Join[]
  options?: Partial<InitOptions<M>>
  onChanges?: (source?: string, model?: M) => Promise<void> | void
}

export class Connection {
  public static entities: EntityConfig[] = []
  public static db: Sequelize
  static initialized = false
  static init() {
    try {
      if (Connection.initialized) {
        logger.warn('Connection already initialized')
        return
      }
      const checkRuntime = config
      if (!checkRuntime) {
        throw new Error(
          'Connection Class cannot read config, undefined variable - check for cyclic dependency'
        )
      }
      const cfg = config.db
      if (!cfg.url || !cfg.database) {
        logger.error('DB URL not found, skipping DB init')
        return
      }
      if (cfg.trace) {
        logger.info(`Initializing DB...`)
      }
      const sequelize = new Sequelize(cfg.url, {
        logging: sql => (cfg.trace ? logger.info(`${sql}\n`) : undefined),
        ssl: !!cfg.ssl,
        dialectOptions: cfg.ssl
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false
              }
            }
          : {}
      })
      Connection.db = sequelize
      const sorted = Connection.entities.sort(sortEntities)
      initModels(sorted)
      Connection.initialized = true
    } catch (error) {
      logger.error('Error initializing DB', error)
      return
    }
  }
}

export default Connection
