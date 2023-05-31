import { DataTypes } from 'sequelize'
import { EntityDefinition, Join, addModel } from '../../db'
import { Item } from '@lib'
import { CategoryModel } from './category'
import { ItemCategoryModel } from './item.category'

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

const joins: Join[] = [
  {
    target: CategoryModel,
    through: ItemCategoryModel,
    type: 'belongsToMany',
    foreignKey: 'itemId',
    otherKey: 'categoryId'
  }
]

export const ItemModel = addModel<Item>({
  name: 'item',
  attributes: ItemDefinition,
  joins
})
