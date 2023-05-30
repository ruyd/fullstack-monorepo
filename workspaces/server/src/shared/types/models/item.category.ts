import { DataTypes } from 'sequelize'
import { addModel } from 'src/shared/db'
import { ItemModel } from './item'
import { CategoryModel } from './category'

export interface ItemCategory {
  itemId: string
  categoryId: string
}

export const ItemCategoryModel = addModel<ItemCategory>({
  name: 'itemCategory',
  attributes: {
    itemId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    categoryId: {
      type: DataTypes.UUID,
      primaryKey: true
    }
  },
  joins: [
    {
      as: 'item',
      model: ItemModel,
      type: 'belongsTo',
      foreignKey: 'itemId'
    },
    {
      as: 'category',
      model: CategoryModel,
      type: 'belongsTo',
      foreignKey: 'categoryId'
    }
  ]
})
