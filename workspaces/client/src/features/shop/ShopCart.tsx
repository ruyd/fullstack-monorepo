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
import { Cart, Drawing } from '@lib'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { patch } from '../app'
import { cartAsync, loadAsync } from './thunks'
import {
  Add,
  Delete,
  DeleteForever,
  DeleteForeverOutlined,
  DeleteOutlined,
  PlusOne,
  Remove,
} from '@mui/icons-material'
import { styled } from '@mui/system'
import { number } from 'prop-types'

const QuantityBox = styled(ButtonGroup)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-radius: 8px;
  border: 1px solid rgba(106, 122, 138, 0.32);
`

export function ShopCart(props?: BoxProps & Partial<React.Component>) {
  const dispatch = useAppDispatch()
  const deleteHandler = (cart: Cart) =>
    dispatch(cartAsync({ item: cart.drawing as Drawing, quantity: 0 }))
  const items = useAppSelector(store => store.shop.items) || []
  const subtotal = items.reduce((a, b) => a + b.quantity * (b.drawing?.price || 0), 0)
  const format = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format
  const formatted = (value?: number) => (value ? format(value) : '')

  return (
    <Box {...props} sx={{ flex: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Card>
            <CardHeader
              title={`Total Products: ${items.map(i => i.quantity).reduce((a, b) => a + b, 0)}`}
            />
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ backgroundColor: 'background.paper' }}>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: '14rem' }}>Quantity</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items?.map(item => (
                    <TableRow key={item.cartId}>
                      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                          <img
                            src={item.drawing?.thumbnail}
                            alt={item.drawing?.name}
                            height={100}
                            loading="lazy"
                          />
                        </Box>
                        <Typography variant="h6">{item.drawing?.name}</Typography>
                      </TableCell>
                      <TableCell>{formatted(item.drawing?.price)}</TableCell>
                      <TableCell sx={{ width: '14rem' }}>
                        <QuantityBox>
                          <IconButton
                            onClick={() =>
                              dispatch(
                                cartAsync({
                                  item: item?.drawing as Drawing,
                                  quantity: -1,
                                }),
                              )
                            }
                          >
                            <Remove />
                          </IconButton>
                          <Typography>{item.quantity}</Typography>
                          <IconButton
                            onClick={() =>
                              dispatch(
                                cartAsync({
                                  item: item?.drawing as Drawing,
                                  quantity: 1,
                                }),
                              )
                            }
                          >
                            <Add />
                          </IconButton>
                        </QuantityBox>
                      </TableCell>
                      <TableCell>{formatted(item.quantity * (item.drawing?.price || 0))}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => deleteHandler(item)} title="Delete">
                          <DeleteForeverOutlined />
                        </IconButton>
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
            <CardHeader title="Summary" />
            <CardContent>
              <Typography></Typography>
              <Typography>Products: {items.length}</Typography>
              <Typography>Total: {formatted(subtotal)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ShopCart
