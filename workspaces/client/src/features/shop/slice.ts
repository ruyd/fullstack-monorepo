import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Address, Cart, Drawing, Order, PaymentMethod, Subscription } from '@lib'

export interface ShopState {
  loaded?: boolean
  items: Cart[]
  orders?: Order[]
  subscriptions?: Subscription[]
  addresses?: Address[]
  paymentMethods?: PaymentMethod[]
  showCart?: boolean
  showCheckout?: boolean
  receipt?: Order
  activeItem?: Drawing
  shippingAddressId?: string
  billingAddressId?: string
  paymentMethodId?: string
  activeStep: number
  steps: {
    [key: string]: boolean
  }
}

export const initialState: ShopState = {
  items: [],
  activeStep: 0,
  steps: {},
}

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    patch(state, action: PayloadAction<Partial<ShopState>>) {
      return { ...state, ...action.payload }
    },
    stepStatus(state, payload: PayloadAction<{ [key: string]: boolean }>) {
      state.steps = { ...state.steps, ...payload.payload }
    },
  },
})

export const { patch, stepStatus } = shopSlice.actions
export const actions = shopSlice.actions

export default shopSlice.reducer
