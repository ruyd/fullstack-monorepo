import React from 'react'
import {
  Box,
  type BoxProps,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link
} from '@mui/material'
import { type Cart } from '@lib'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { stepStatus } from './slice'
import { cartAsync } from './thunks'
import { Add, DeleteForeverOutlined, MonetizationOnRounded, Remove } from '@mui/icons-material'
import { styled } from '@mui/system'
import { Paths } from 'src/shared/routes'

const QuantityBox = styled(ButtonGroup)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-radius: 8px;
  border: 1px solid rgba(106, 122, 138, 0.32);
`

export function ShopCart({ ...props }: BoxProps & { readOnly?: boolean }) {
  const dispatch = useAppDispatch()
  const deleteHandler = (cart: Cart) => {
    void dispatch(cartAsync({ ...cart, quantity: 0 }))
  }
  const items = useAppSelector(store => store.shop.items || [])
  const subtotal = items.reduce(
    (a, b) => a + b.quantity * (b.drawing?.price ?? b.product?.amount ?? 0),
    0
  )
  const format = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format
  const formatted = (value?: number) => (value ? format(value) : '')

  React.useEffect(() => {
    dispatch(stepStatus({ cart: items.length > 0 }))
  }, [dispatch, items])

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
                    <TableCell colSpan={2}>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: '14rem' }}>Quantity</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items?.map(item => (
                    <TableRow key={item.cartId}>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box>
                          <Link
                            href={item.drawingId ? Paths.Draw + '/' + item.drawingId : undefined}
                          >
                            {item.cartType === 'tokens' && (
                              <MonetizationOnRounded fontSize="large" />
                            )}
                            {item.cartType !== 'tokens' && (
                              <img
                                src={item.drawing?.thumbnail ?? item.product?.imageUrl}
                                alt={item.drawing?.name ?? item.product?.title}
                                height={100}
                                loading="lazy"
                              />
                            )}
                          </Link>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">
                          {item.drawing?.name ?? item.product?.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatted(item.drawing?.price ?? item.product?.amount)}
                      </TableCell>
                      <TableCell sx={{ width: '14rem' }}>
                        <QuantityBox>
                          <IconButton
                            onClick={() => {
                              void dispatch(
                                cartAsync({
                                  ...item,
                                  quantity: -1
                                })
                              )
                            }}
                          >
                            <Remove />
                          </IconButton>
                          <Typography>{item.quantity}</Typography>
                          <IconButton
                            onClick={() => {
                              void dispatch(
                                cartAsync({
                                  ...item,
                                  quantity: 1
                                })
                              )
                            }}
                          >
                            <Add />
                          </IconButton>
                        </QuantityBox>
                      </TableCell>
                      <TableCell>
                        {formatted(
                          item.quantity * (item.drawing?.price ?? item.product?.amount ?? 0)
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            deleteHandler(item)
                          }}
                          title="Delete"
                        >
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
