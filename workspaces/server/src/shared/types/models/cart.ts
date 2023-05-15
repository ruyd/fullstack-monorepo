import { Cart } from '@lib'
import { DataTypes } from 'sequelize'
import { addModel } from '../../../shared/db'
import { DrawingModel } from './drawing'
import { ProductModel } from './product'

export const CartAttributes = {
  cartId: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  userId: {
    type: DataTypes.UUID
  },
  cartType: {
    type: DataTypes.STRING
  },
  productId: {
    type: DataTypes.STRING
  },
  priceId: {
    type: DataTypes.STRING
  },
  drawingId: {
    type: DataTypes.UUID
  },
  quantity: {
    type: DataTypes.INTEGER
  }
}

export const CartModel = addModel<Cart>('cart', CartAttributes, [
  {
    relation: 'belongsTo',
    model: DrawingModel,
    foreignKey: 'drawingId',
    as: 'drawing'
  },
  {
    relation: 'belongsTo',
    model: ProductModel,
    foreignKey: 'productId',
    as: 'product'
  }
])

export default CartModel
