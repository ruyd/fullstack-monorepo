import { DataTypes } from 'sequelize'
import { addModel } from '../../db'
import { Subscription, SubscriptionPlan } from '@lib'

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

export const SubscriptionPlanModel = addModel<SubscriptionPlan>('subscriptionPlan', {
  subscriptionPlanId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.INTEGER,
  },
  interval: {
    type: DataTypes.STRING,
  },
  intervalCount: {
    type: DataTypes.INTEGER,
  },
  trialPeriodDays: {
    type: DataTypes.INTEGER,
  },
  mappings: {
    type: DataTypes.JSON,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
  },
})
