/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import {
  Box,
  BoxProps,
  Button,
  Card,
  CardHeader,
  Grid,
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

export function ShopCart(props?: BoxProps & Partial<React.Component>) {
  const dispatch = useAppDispatch()
  const deleteHandler = (cart: Cart) =>
    dispatch(cartAsync({ item: cart.drawing as Drawing, quantity: 0 }))
  const items = useAppSelector(store => store.shop.items)

  return (
    <Box {...props}>
      <Grid container>
        <Grid item xs={9}>
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
                            loading="lazy"
                          />
                        </Box>
                        <Typography>{item.drawing?.name}</Typography>
                      </TableCell>
                      <TableCell>{item.drawing?.price}</TableCell>
                      <TableCell>
                        <TextField type="number" value={item.quantity} />
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
        <Grid item xs={3}></Grid>
      </Grid>
    </Box>
  )
}

export default ShopCart
