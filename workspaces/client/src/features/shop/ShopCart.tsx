/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Box, BoxProps, Button, TextField, Typography } from '@mui/material'
import { Cart, Drawing } from '@shared/lib'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch } from '../app'
import { cartAsync } from './thunks'

export function ShopCart(props?: BoxProps & Partial<React.Component>) {
  const dispatch = useAppDispatch()
  const deleteHandler = (cart: Cart) =>
    dispatch(cartAsync({ item: cart.drawing as Drawing, quantity: 0 }))
  const items = useAppSelector(store => store.shop.items)

  return (
    <Box {...props}>
      {items?.map(item => (
        <Box key={item.drawingId}>
          <Typography>{item.drawing?.name}</Typography>
          <Typography>{item.drawing?.price}</Typography>
          <TextField type="number" value={item.quantity} />
          <Button onClick={() => deleteHandler(item)}>Delete</Button>
        </Box>
      ))}
    </Box>
  )
}

export default ShopCart
