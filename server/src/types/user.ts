import { User } from '@root/lib'
import { Model, DataTypes } from 'sequelize'
import db, { commonOptions } from '../shared/db'

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

export const UserModel = db.define<UserInstance>('user', UserAttributes, {
  ...commonOptions,
})
