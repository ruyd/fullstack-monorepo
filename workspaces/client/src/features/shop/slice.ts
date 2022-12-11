import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Address, Cart, Drawing, Order, PaymentMethod, Subscription } from '@shared/lib'

export interface ShopState {
  loaded?: boolean
  items: Cart[]
  orders?: Order[]
  subscriptions?: Subscription[]
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
