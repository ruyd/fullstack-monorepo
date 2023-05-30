import { Category } from '@lib'
import { DataTypes } from 'sequelize'
import { EntityDefinition, addModel } from 'src/shared/db'

export const CategoryDefinition: EntityDefinition<Category> = {
  categoryId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING
  },
  imageUrl: {
    type: DataTypes.STRING
  }
}

export const CategoryModel = addModel<Category>({
  name: 'category',
  attributes: CategoryDefinition
})
