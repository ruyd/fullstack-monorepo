import { Model, ModelAttributeColumnOptions, ModelStatic, Sequelize } from 'sequelize'
import Connection, { EntityConfig, commonOptions } from '.'
import logger from '../logger'
import config from '../config'

export function sortEntities(a: EntityConfig, b: EntityConfig): number {
  const primaryKeysA = Object.keys(a.attributes).filter(
    key => (a.attributes[key] as ModelAttributeColumnOptions).primaryKey
  )
  const primaryKeysB = Object.keys(b.attributes).filter(
    key => (b.attributes[key] as ModelAttributeColumnOptions).primaryKey
  )
  if (primaryKeysA.some(key => b.attributes[key])) {
    return -1
  }
  if (primaryKeysB.some(key => a.attributes[key])) {
    return 1
  }
  return 0
}
export function isModel(model: any, sequelize: any) {
  return model && model.prototype && model.prototype instanceof sequelize.Sequelize.Model
}

export function initJoins(sorted: EntityConfig[]) {
  for (const entity of sorted) {
    if (!entity?.model) {
      return
    }

    const joins = entity.joins ?? []
    for (const join of joins) {
      try {
        entity.model[join.type](join.target as ModelStatic<Model>, {
          foreignKey: join.foreignKey as string,
          otherKey: join.otherKey as string,
          through: join.through as ModelStatic<Model>,
          as: join.as as string
        })
      } catch (error) {
        logger.error(
          `Error initializing join ${entity.name} ${join.type} ${join.target.name}`,
          error
        )
      }
    }
  }
}

/**
 * Detect joins based on fieldId naming convention
 * */
export function autoDetectJoins(sorted: EntityConfig[]) {
  for (const entity of sorted) {
    if (!entity?.model) {
      return
    }
    const otherModels = Connection.entities.filter(e => e.name !== entity.name)
    for (const other of otherModels) {
      if (entity.model.associations[other.name]) {
        continue
      }
      const otherPrimaryKeys = Object.keys(other.attributes).filter(
        key => (other.attributes[key] as ModelAttributeColumnOptions).primaryKey
      )
      for (const otherPrimaryKey of otherPrimaryKeys) {
        const columnDef = entity.attributes[otherPrimaryKey] as ModelAttributeColumnOptions
        if (otherPrimaryKey.endsWith('Id') && columnDef && !columnDef.primaryKey) {
          entity.model.belongsTo(other.model as ModelStatic<Model>, {
            foreignKey: otherPrimaryKey,
            onDelete: 'CASCADE'
          })
          other.model?.hasMany(entity.model, {
            foreignKey: otherPrimaryKey
          })
        }
      }
    }
  }
}

export function initModels(sorted: EntityConfig[]) {
  if (!Connection.db) {
    throw new Error('Connection.db undefined')
  }

  for (const entity of sorted) {
    const scopedOptions = {
      ...commonOptions,
      ...entity.options,
      sequelize: Connection.db,
      modelName: entity.name
    }
    if (!entity.model) {
      logger.error(`Entity without model: ${entity.name}`)
      continue
    }
    if (entity.model.name !== entity.name) {
      entity.model = entity.model.init(entity.attributes, scopedOptions)
    }
  }

  initJoins(sorted)
  autoDetectJoins(sorted)
}

export function getAssociations(name: string) {
  const entity = Connection.entities.find(e => e.name == name)
  if (!entity) {
    throw new Error(`Entity ${name} not found`)
  }
  const primaryKeys = Object.keys(entity.attributes).filter(
    key => (entity.attributes[key] as ModelAttributeColumnOptions).primaryKey
  )
  const others = Connection.entities.filter(e => e.name !== name)
  const associations = others.filter(related => primaryKeys.some(key => related.attributes[key]))
  return associations
}

/**
 * Deferred model registration for
 * sequelize and model-api endpoints
 *
 * @param name - table name
 * @param attributes - columns definitions
 * @param roles - restrict to roles like Admin
 * @param publicRead - Set GET and LIST public (no token needed)
 * @param publicWrite - POST, PUT, PATCH (no token needed)
 * @returns Typed model class reference with methods/utilities
 */
export function addModel<T extends object>({
  name,
  attributes,
  joins,
  roles,
  publicRead,
  publicWrite,
  onChanges,
  options
}: EntityConfig<Model<T>>): ModelStatic<Model<T, T>> {
  const model = class extends Model {}
  const cfg: EntityConfig = {
    name,
    attributes,
    joins,
    roles,
    model,
    publicRead,
    publicWrite,
    onChanges,
    options
  }
  Connection.entities.push(cfg)
  return model
}

export async function createDatabase(): Promise<boolean> {
  logger.info('Database does not exist, creating...')

  const rootUrl = config.db.url.replace(config.db.database, 'postgres')
  const root = new Sequelize(rootUrl)
  const qi = root.getQueryInterface()
  try {
    await qi.createDatabase(config.db.database)
    logger.info('Database created: ' + config.db.database)
    await Connection.db.sync()
    logger.info('Tables created')
  } catch (e: unknown) {
    logger.warn('Database creation failed: ' + JSON.stringify(e), e)
    return false
  }
  return true
}
