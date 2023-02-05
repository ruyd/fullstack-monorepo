import React from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { PaymentIntent, PaymentIntentResult, StripePaymentElementOptions } from '@stripe/stripe-js'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import { checkoutAsync } from './thunks'

export function StripePay({
  intent,
  onLoading,
}: {
  intent?: Partial<PaymentIntent>

  onLoading?: (loading: boolean) => void
}) {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.app.user)
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = React.useState<string | undefined>()
  const [result, setResult] = React.useState<PaymentIntentResult>()
  const [isLoading, setIsLoading] = React.useState(false)
  const clientSecret = intent?.client_secret || undefined
  const elementOptions: StripePaymentElementOptions = {
    fields: {
      billingDetails: 'never',
    },
  }

  React.useEffect(() => {
    if (onLoading) {
      onLoading(isLoading)
    }
  }, [isLoading, onLoading])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setMessage(undefined)
    setIsLoading(true)
    try {
      const res = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
          payment_method_data: {
            billing_details: {
              name: user?.firstName,
              email: user?.email,
              phone: '',
              address: {
                country: 'US',
                state: '',
                city: '',
                line1: '',
                line2: '',
                postal_code: '',
              },
            },
          },
        },
        redirect: 'if_required',
      })
      if (res?.error?.message) {
        setMessage(res?.error.message)
      } else {
        setResult(res)
        dispatch(checkoutAsync(res))
      }
    } catch (error: any) {
      setMessage(error.message)
      return
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ minWidth: '400px' }}>
      <form id="payment-form" onSubmit={handleSubmit}>
        {isLoading && <CircularProgress />}
        {!result && (
          <>
            {!isLoading && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="h5">Please enter card details</Typography>
              </Box>
            )}
            {message && (
              <Alert color="error" variant="filled" sx={{ m: '1rem 1rem 0 1rem' }}>
                {message}
              </Alert>
            )}
            <PaymentElement options={elementOptions} />
            <Button disabled={isLoading} type="submit" fullWidth variant="contained" size="large">
              <span id="button-text">{isLoading ? 'Loading...' : 'Pay Now'}</span>
            </Button>
          </>
        )}
      </form>
    </Box>
  )
}

export default StripePay
