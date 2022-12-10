import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Address, Cart, Drawing, Order, PaymentMethod } from '@shared/lib'

export interface ShopState {
  items: Cart[]
  orders?: Order[]
  subscriptions?: any[]
  addresses?: Address[]
  paymentMethods?: PaymentMethod[]
  showCart?: boolean
  showCheckout?: boolean
  intent?: string
  activeItem?: Drawing
  shippingAddressId?: string
  billingAddressId?: string
  paymentMethodId?: string
}

export const initialState: ShopState = {
  items: [],
}

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    patch(state, action: PayloadAction<Partial<ShopState>>) {
      return { ...state, ...action.payload }
    },
  },
})

export const { patch } = shopSlice.actions
export const actions = shopSlice.actions

export default shopSlice.reducer
