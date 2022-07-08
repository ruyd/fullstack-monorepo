import { DataTypes, Model } from 'sequelize'
import db, { commonOptions } from '../../shared/db'

export interface User {
  userId: string
  name: string
  email: string
  createdAt?: Date
  updatedAt?: Date
}

export type UserInstance = Model<User>

export const UserModel = db.define<UserInstance>(
  'user',
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  {
    ...commonOptions,
  }
)
