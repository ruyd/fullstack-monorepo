import { useAppSelector } from '../../shared/store'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { MonetizationOnRounded } from '@mui/icons-material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AccordionDetails from '@mui/material/AccordionDetails'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'

export function OrderItems() {
  const items = useAppSelector(store => store.shop.items || [])
  const subtotal = items.reduce(
    (a, b) => a + b.quantity * (b.drawing?.price ?? b.product?.amount ?? 0),
    0
  )
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
                  <TableCell
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Box>
                      {item.cartType === 'tokens' && (
                        <MonetizationOnRounded sx={{ m: '5px 5px 0 2px' }} />
                      )}
                      {item.cartType !== 'tokens' && (
                        <img
                          src={item.drawing?.thumbnail ?? item.product?.imageUrl}
                          alt={item.drawing?.name ?? item.product?.title}
                          height={100}
                          loading="lazy"
                        />
                      )}
                    </Box>
                    <Typography variant="h6">
                      {item.drawing?.name ?? item.product?.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatted(item.drawing?.price ?? item.product?.amount)}</TableCell>
                  <TableCell sx={{ width: '14rem', textAlign: 'center' }}>
                    <Typography>{item.quantity}</Typography>
                  </TableCell>
                  <TableCell>
                    {formatted(item.quantity * (item.drawing?.price || item.product?.amount || 0))}
                  </TableCell>
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
