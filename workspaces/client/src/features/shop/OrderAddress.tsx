import { useAppSelector } from 'src/shared/store'
import { ExpandMore } from '@mui/icons-material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'

export default function OrderAddress() {
  const enableShipping = useAppSelector(state => state.app.settings?.system?.enableShippingAddress)
  const shippingAddressId = useAppSelector(state => state.shop.shippingAddressId)
  const addresses = useAppSelector(state => state.shop.addresses)
  const shippingAddress = addresses?.find(a => a.addressId === shippingAddressId)

  if (!enableShipping) {
    return null
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: '16px' }}>
        <Typography>Shipping Address</Typography>
        <Typography
          variant="body2"
          sx={{ flex: 1, textOverflow: 'ellipsis', textAlign: 'right', mr: 1 }}
        >
          {shippingAddress?.address1}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid item xs={12}>
            <Typography>{shippingAddress?.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>{shippingAddress?.address1}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>{shippingAddress?.address2}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zip}{' '}
              {shippingAddress?.country}
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}
