import { addModel } from 'src/shared/db'

export interface Category {
  CategoryId: string
  title: string
  description: string
  imageUrl: string
}

export const CategoryDefinition = {
  CategoryId: {
    type: 'string',
    required: true,
    unique: true,
  },
  title: {
    type: 'string',
    required: true,
  },
  description: {
    type: 'string',
    required: true,
  },
  imageUrl: {
    type: 'string',
    required: true,
  },
  keywords: {
    type: 'string',
    required: false,
  },
}

export const CategoryModel = addModel<Category>('Category', CategoryDefinition)
