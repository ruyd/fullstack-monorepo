import sequelize, { Model } from 'sequelize'
import db, { commonOptions } from '../../shared/db'

export interface Drawing {
  id: number
  userId: string
  name: string
  data?: string
  history?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export type DrawingInstance = Model<Drawing>

export const DrawingModel = db.define<DrawingInstance>(
  'drawing',
  {
    id: {
      type: sequelize.UUID,
      primaryKey: true,
    },
    userId: {
      type: sequelize.UUID,
    },
    name: {
      type: sequelize.STRING,
    },
  },
  {
    ...commonOptions,
  }
)
