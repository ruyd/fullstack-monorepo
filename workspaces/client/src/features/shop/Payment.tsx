import React from 'react'
import Typography from '@mui/material/Typography'
import { Box, List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material'
import StripeCheckout from './StripeCheckout'
import { useAppSelector } from 'src/shared/store'
import OrderAddress from './OrderAddress'
import OrderItems from './OrderItems'

export default function PaymentStep() {
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
      component: <StripeCheckout />,
      label: 'Card',
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
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack>
        <Stack sx={{ m: 2 }} spacing={2}>
          <OrderAddress />
          <OrderItems />
        </Stack>
        {!option && (
          <Box sx={{ textAlign: 'center' }}>
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
          </Box>
        )}
        {option && option.component}
      </Stack>
    </Box>
  )
}
