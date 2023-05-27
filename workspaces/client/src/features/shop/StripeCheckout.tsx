import React, { useEffect, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js/pure'
import { Elements } from '@stripe/react-stripe-js'
import { Stripe, PaymentIntentResult } from '@stripe/stripe-js'
import { useAppSelector } from '../../shared/store'
import StripePay from './StripePay'
import { config } from '../../shared/config'
import { request } from '../app'
import StripeLogo from './images/stripe.png'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

let stripePromise: Promise<Stripe | null>
function getStripe() {
  if (!stripePromise && config.settings?.system?.paymentMethods?.stripe?.publishableKey) {
    stripePromise = loadStripe(config.settings?.system?.paymentMethods?.stripe?.publishableKey)
  }
  return stripePromise
}

function LoadingView() {
  return (
    <Stack
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '400px' }}
    >
      <CircularProgress sx={{ m: 1 }} />
      <img src={StripeLogo} />
    </Stack>
  )
}

export default function StripeCheckout({
  children,
  onLoading = undefined
}: React.PropsWithChildren<{
  onApproval?: (result: PaymentIntentResult) => void
  onLoading?: () => void
}>): JSX.Element {
  const stripe = useMemo(getStripe, [
    config.settings?.system?.paymentMethods?.stripe?.publishableKey
  ])
  const [intent, setIntent] = React.useState<PaymentIntentResult | undefined>()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const isLoadingRef = React.useRef<boolean>(false)
  const token = useAppSelector(state => state.app.token)

  const clientSecret = intent?.paymentIntent?.client_secret || undefined

  useEffect((): void => {
    if (intent || !token || isLoadingRef.current) {
      return
    }
    const run = async (): Promise<void> => {
      setIsLoading(true)
      isLoadingRef.current = true
      const result = await request<PaymentIntentResult>('/stripe/payment/intent', {}, 'post', {
        validateStatus: () => true
      })
      isLoadingRef.current = false
      setIsLoading(false)
      if (result.data) {
        setIntent(result.data)
      } else {
        setIntent({ error: { message: result.statusText, type: 'api_error' } })
      }
    }
    run()
  }, [intent, token, isLoading])

  if (intent?.error) {
    return (
      <Typography color="error" variant="h3">
        Error: {intent.error.message}
      </Typography>
    )
  }

  if (!stripe || !intent || isLoading) {
    return <LoadingView />
  }

  return (
    <Elements stripe={stripe} options={{ clientSecret }}>
      <StripePay intent={intent.paymentIntent} onLoading={onLoading} />
      {children}
    </Elements>
  )
}
