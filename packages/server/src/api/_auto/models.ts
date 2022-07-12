import { Drawing, DrawingAttributes, entities } from '@root/lib'
import { Model, ModelAttributes, ModelStatic } from 'sequelize'
import db, { commonOptions } from '../../shared/db'

// export type DrawingInstance = Model<Drawing>

// export const DrawingModel = db.define<DrawingInstance>(
//   DrawingAttributes.name,
//   DrawingAttributes.attributes as ModelAttributes<
//     DrawingInstance,
//     Attributes<DrawingInstance>
//   >,
//   {
//     ...commonOptions,
//   }
// )

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

initializeModels()

export default models
