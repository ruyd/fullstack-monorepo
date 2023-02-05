import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { useAppSelector } from '../../shared/store'
import ExpandMore from '@mui/icons-material/ExpandMore'

export function OrderItems() {
  const items = useAppSelector(store => store.shop.items || [])
  const subtotal = items.reduce((a, b) => a + b.quantity * (b.drawing?.price || 0), 0)
  const format = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format
  const formatted = (value?: number) => (value ? format(value) : '')

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: '16px' }}>
        <Typography>Order Summary</Typography>
        <Box sx={{ flex: 1 }} />
        <Typography variant="body2" sx={{ mr: 1 }}>
          Total: {formatted(subtotal)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell sx={{ textAlign: 'center', width: '14rem' }}>Quantity</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: 'transparent' }}>
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
                  <TableCell sx={{ width: '14rem', textAlign: 'center' }}>
                    <Typography>{item.quantity}</Typography>
                  </TableCell>
                  <TableCell>{formatted(item.quantity * (item.drawing?.price || 0))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  )
}

export default OrderItems
