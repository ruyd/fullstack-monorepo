/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { Box, Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import StripeCheckout from './StripeCheckout'
import { useAppSelector } from 'src/shared/store'

export default function PaymentForm() {
  const settings = useAppSelector(state => state.app.settings?.system?.paymentMethods)
  const [option, setOption] = React.useState<
    | {
        name: string
        component: JSX.Element
        label: string
      }
    | undefined
  >()
  const options = [
    {
      name: 'stripe',
      component: <StripeCheckout modalState={() => ({})} />,
      label: 'Credit Card processed with Stripe',
      enabled: settings?.stripe?.enabled,
    },
    {
      name: 'paypal',
      component: <></>,
      label: 'PayPal',
      enabled: settings?.paypal?.enabled,
    },
    {
      name: 'fake',
      component: <></>,
      label: 'Just Fake Payment',
      enabled: process.env.NODE_ENV === 'development',
    },
  ]
  return (
    <Grid
      container
      sx={{ flex: 1, textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
    >
      {!option && (
        <Grid item>
          <Typography variant="h6">How do you want to pay?</Typography>
          <List>
            {options
              .filter(a => a.enabled)
              .map(item => (
                <ListItem key={item.name}>
                  <ListItemButton onClick={() => setOption(item)} selected={option === item.name}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Grid>
      )}
      {option && option.component}
    </Grid>
  )
}
