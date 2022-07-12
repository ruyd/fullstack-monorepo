import { Drawing } from '@root/lib'
import { Model, DataTypes, ModelAttributes, Attributes } from 'sequelize'
import db, { commonOptions } from '../../shared/db'

export interface ModelConfig {
  name: string
  attributes: ModelAttributes<Model, Attributes<Model>>
}

export const entities: ModelConfig[] = []

entities.push({
  name: 'DrawingDynamic',
  attributes: {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
    },
    history: {
      type: DataTypes.JSONB,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
  },
})

export type DrawingInstance = Model<Drawing>

export const DrawingModel = db.define<DrawingInstance>(
  'drawing',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
    },
    history: {
      type: DataTypes.JSONB,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
  },
  {
    ...commonOptions,
  }
)
