import { User } from '@shared/lib'
import { Model, DataTypes } from 'sequelize'
import { register } from '../db'

export type UserInstance = Model<User>

export const UserAttributes = {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  picture: {
    type: DataTypes.STRING,
  },
}

export const UserModel = register<User>('user', UserAttributes)

export interface UserActive {
  socketId: string
  userId: string
  ip?: string
  userAgent?: string
}

export const UserActiveModel = register<UserActive>('user_active', {
  socketId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
  },
  ip: {
    type: DataTypes.STRING,
  },
  userAgent: {
    type: DataTypes.STRING,
  },
})
