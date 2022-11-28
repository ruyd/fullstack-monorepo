import { Setting } from '@shared/lib'
import { DataTypes } from 'sequelize'
import { addModel } from 'src/shared/db'

export const SettingModel = addModel<Setting>('setting', {
  name: {
    primaryKey: true,
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  value: {
    type: DataTypes.STRING,
  },
  values: {
    type: DataTypes.JSONB,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
  },
})

export default SettingModel
