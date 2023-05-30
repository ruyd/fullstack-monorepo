import { DataTypes } from 'sequelize'
import { EntityDefinition, addModel } from '../../db'
import { Item } from '@lib'

export const ItemDefinition: EntityDefinition<Item> = {
  itemId: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING
  },
  urlName: {
    type: DataTypes.STRING
  },
  subscriptions: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  tokens: {
    type: DataTypes.INTEGER
  },
  price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  currency: {
    type: DataTypes.STRING
  },
  inventory: {
    type: DataTypes.INTEGER
  },
  paywall: {
    type: DataTypes.BOOLEAN
  }
}

export const ItemModel = addModel<Item>({
  name: 'item',
  attributes: ItemDefinition
})
