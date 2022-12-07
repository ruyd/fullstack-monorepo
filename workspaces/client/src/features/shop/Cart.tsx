import { Box, Button, Typography } from '@mui/material'
import { useAppDispatch } from 'src/shared/store'
import { patch } from '../app'

export function Cart() {
  const dispatch = useAppDispatch()
  const checkout = () => dispatch(patch({ dialog: 'checkout' }))

  return (
    <Box>
      <Typography>Cart</Typography>
      <Button onClick={checkout}>Checkout</Button>
    </Box>
  )
}

export default Cart
