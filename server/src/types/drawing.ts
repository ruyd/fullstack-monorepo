import { DataTypes, Model } from 'sequelize'
import { db } from '../shared/db'
import { Drawing } from '@root/lib'
import { UserModel } from './user'

export const DrawingModel = db.define<Model<Drawing>>('drawing', {
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
    type: DataTypes.TEXT,
  },
})

DrawingModel.hasOne(UserModel)
