import { Setting } from '@lib'
import { DataTypes } from 'sequelize'
import { sendConfig } from '../../../shared/socket'
import { addModel } from '../../../shared/db'

export const SettingModel = addModel<Setting>({
  name: 'setting',
  attributes: {
    name: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    data: {
      type: DataTypes.JSONB
    }
  },
  joins: [],
  roles: ['admin'],
  publicRead: false,
  publicWrite: false,
  onChanges: sendConfig
})

export default SettingModel
