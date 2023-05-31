import { DataTypes } from 'sequelize'
import { addModel } from 'src/shared/db'

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
      type: DataTypes.STRING,
      primaryKey: true
    }
  },
  options: {
    timestamps: false
  }
})
