import { DataTypes } from 'sequelize'
import { addModel } from '../../db'
import { Subscription } from '@lib'

export const SubscriptionModel = addModel<Subscription>('subscription', {
  subscriptionId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.UUID,
  },
  orderId: {
    type: DataTypes.UUID,
  },
})
