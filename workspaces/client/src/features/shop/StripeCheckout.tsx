/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js/pure'
import { Elements } from '@stripe/react-stripe-js'
import { Stripe, PaymentIntentResult } from '@stripe/stripe-js'
import { useAppSelector } from '../../shared/store'
import StripeForm from './StripePay'
import { CircularProgress, Typography } from '@mui/material'
import { config } from '../../shared/config'

let stripePromise: Promise<Stripe | null>
function getStripe() {
  if (!stripePromise && config.keys.stripe) {
    stripePromise = loadStripe(config.keys.stripe)
  }
  return stripePromise
}

function LoadingView() {
  return (
    <div className="flex-center-column">
      <CircularProgress size="l" />
      <Typography>Loading payment form...</Typography>
    </div>
  )
}

export default function StripeCheckout({
  children,
  modalState,
  approveCallback = undefined,
  onLoading = undefined,
}: React.PropsWithChildren<{
  modalState: () => void
  approveCallback?: () => void
  onLoading?: () => void
}>): JSX.Element {
  const stripe = useMemo(getStripe, [config.keys.stripe])
  const [intent, setIntent] = React.useState<PaymentIntentResult | undefined>()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const token = useAppSelector(state => state.app.token)
  const userEmail = useAppSelector(state => state.app.user?.email)
  const activeItem = useAppSelector(state => state.shop.activeItem)
  const amount = activeItem?.price?.toFixed(2).replace('.', '')
  const currency = 'USD'
  const payload = useMemo(() => {
    return {
      amount,
      currency,
      metadata: {
        drawingId: activeItem?.drawingId || '',
      },
      receipt_email: userEmail || '',
    }
  }, [amount, currency, userEmail, activeItem])
  const clientSecret = intent?.paymentIntent?.client_secret || undefined

  // useEffect((): void => {
  //   if (intent || !token) {
  //     return
  //   }
  //   setIsLoading(true)
  //   createPaymentIntent(payload)
  //     .then(res => res.json())
  //     .then(data => {
  //       setIntent(data)
  //     })
  //     .finally(() => {
  //       setIsLoading(false)
  //     })
  // }, [intent, payload, token])

  function onSubmitHandler(): void {
    if (approveCallback) {
      approveCallback()
    }
    modalState()
  }

  if (!stripe || !intent || isLoading) {
    return <LoadingView />
  }

  if (intent.error) {
    return <div>Error: {intent.error.message}</div>
  }

  return (
    <Elements stripe={stripe} options={{ clientSecret }}>
      <StripeForm intent={intent.paymentIntent} onSubmit={onSubmitHandler} onLoading={onLoading} />
      {children}
    </Elements>
  )
}
