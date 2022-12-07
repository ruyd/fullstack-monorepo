import { Box, Button, TextField, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch } from '../app'

export function Cart() {
  const dispatch = useAppDispatch()
  const checkout = () => dispatch(patch({ dialog: 'checkout' }))
  const items = useAppSelector(store => store.shop.items)

  return (
    <Box>
      <Typography>Cart</Typography>
      {items?.map(item => (
        <Box key={item.drawingId}>
          <Typography>{item.drawing?.name}</Typography>
          <Typography>{item.drawing?.price}</Typography>
          <TextField type="number" value={item.quantity} />
        </Box>
      ))}
      <Button onClick={checkout}>Checkout</Button>
    </Box>
  )
}

export default Cart
