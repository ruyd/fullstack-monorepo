import { DataTypes, Model } from 'sequelize'
import db, { commonOptions } from '../../shared/db'

export interface User {
  id: string
  name: string
  email: string
  createdAt?: Date
  updatedAt?: Date
}

export type UserInstance = Model<User>

export const UserModel = db.define<UserInstance>(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
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
