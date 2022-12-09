/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import {
  Box,
  BoxProps,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { Cart, Drawing } from '@shared/lib'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch } from '../app'
import { cartAsync } from './thunks'
import { Add, PlusOne, Remove } from '@mui/icons-material'
import { styled } from '@mui/system'

const QuantityBox = styled(ButtonGroup)`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  padding: 4px 6px;
  border-radius: 8px;
  border: 1px solid rgba(106, 122, 138, 0.32);
  width: 10rem;
`

export function ShopCart(props?: BoxProps & Partial<React.Component>) {
  const dispatch = useAppDispatch()
  const deleteHandler = (cart: Cart) =>
    dispatch(cartAsync({ item: cart.drawing as Drawing, quantity: 0 }))
  const items = useAppSelector(store => store.shop.items)

  return (
    <Box {...props}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Card>
            <CardHeader>
              <Typography variant="h6">Cart</Typography>
            </CardHeader>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items?.map(item => (
                    <TableRow key={item.drawingId}>
                      <TableCell sx={{ display: 'flex' }}>
                        <Box>
                          <img
                            src={item.drawing?.thumbnail}
                            alt={item.drawing?.name}
                            height={100}
                            loading="lazy"
                          />
                        </Box>
                        <Typography>{item.drawing?.name}</Typography>
                      </TableCell>
                      <TableCell>{item.drawing?.price}</TableCell>
                      <TableCell>
                        <QuantityBox>
                          <IconButton onClick={() => dispatch(patch({}))}>
                            <Remove />
                          </IconButton>
                          <Typography>{item.quantity}</Typography>
                          <IconButton>
                            <Add />
                          </IconButton>
                        </QuantityBox>
                      </TableCell>
                      <TableCell>{item.quantity * (item.drawing?.price || 0)}</TableCell>
                      <TableCell>
                        <Button onClick={() => deleteHandler(item)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader
              title={`Total Products: ${items.map(i => i.quantity).reduce((a, b) => a + b, 0)}`}
            />
            <CardContent>
              <Typography></Typography>
              <Typography>Products: {items.length}</Typography>
              <Typography>Subtotal: $0</Typography>
              <Typography>Shipping: $0</Typography>
              <Typography>Total: $0</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ShopCart
