import { Drawing, DrawingAttributes, entities } from '@root/lib'
import { Model, ModelAttributes, ModelStatic } from 'sequelize'
import db, { commonOptions } from '../../shared/db'

export const models: ModelStatic<Model>[] = []

export function initializeModels() {
  entities.forEach((entity) => {
    models.push(
      db.define(entity.name, entity.attributes as ModelAttributes<Model>, {
        ...commonOptions,
      })
    )
  })
}

export default models
