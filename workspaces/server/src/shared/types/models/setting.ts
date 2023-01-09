import { Setting } from '@lib'
import { DataTypes } from 'sequelize'
import { sendConfig } from 'src/shared/socket'
import { addModel } from '../../../shared/db'

export const SettingModel = addModel<Setting>(
  'setting',
  {
    name: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.JSONB,
    },
  },
  [],
  ['admin'],
  false,
  false,
  sendConfig,
)

export default SettingModel
