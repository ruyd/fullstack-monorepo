import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Drawing } from '@shared/lib'

export interface ShopState {
  cart: Drawing[]
  showCart?: boolean
  showCheckout?: boolean
  intent?: string
  activeItem?: Drawing
}

export const initialState: ShopState = {
  cart: [],
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
