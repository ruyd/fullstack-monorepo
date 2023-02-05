/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import {
  Grid,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material'
import { useAppSelector } from 'src/shared/store'
import OrderItems from './OrderItems'
import { ExpandMore } from '@mui/icons-material'

export default function OrderSummary() {
  const shippingAddressId = useAppSelector(state => state.shop.shippingAddressId)
  const addresses = useAppSelector(state => state.shop.addresses)
  const shippingAddress = addresses?.find(a => a.addressId === shippingAddressId)
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
