/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js/pure'
import { Elements } from '@stripe/react-stripe-js'
import { Stripe, PaymentIntentResult } from '@stripe/stripe-js'
import { useAppSelector } from '../../shared/store'
import StripeForm from './StripePay'
import { CircularProgress, Typography } from '@mui/material'
import { config } from '../../shared/config'
import { request } from '../app'

let stripePromise: Promise<Stripe | null>
function getStripe() {
  if (!stripePromise && config.settings?.system?.paymentMethods?.stripe?.publishableKey) {
    stripePromise = loadStripe(config.settings?.system?.paymentMethods?.stripe?.publishableKey)
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
  const stripe = useMemo(getStripe, [
    config.settings?.system?.paymentMethods?.stripe?.publishableKey,
  ])
  const [intent, setIntent] = React.useState<PaymentIntentResult | undefined>()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const isLoadingRef = React.useRef<boolean>(false)
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

  useEffect((): void => {
    if (intent || !token || isLoadingRef.current) {
      return
    }
    const run = async (): Promise<void> => {
      setIsLoading(true)
      isLoadingRef.current = true
      const result = await request<PaymentIntentResult>('/stripe/payment/intent', {}, 'post', {
        validateStatus: status => true,
      })
      isLoadingRef.current = false
      setIsLoading(false)
      if (result.status === 200) {
        setIntent(result.data as any)
      } else {
        setIntent({ error: { message: result.statusText, type: 'api_error' } })
      }
    }
    run()
  }, [intent, payload, token, isLoading])

  function onSubmitHandler(): void {
    if (approveCallback) {
      approveCallback()
    }
    modalState()
  }

  if (intent?.error) {
    return <div>Error: {intent.error.message}</div>
  }

  if (!stripe || !intent || isLoading) {
    return <LoadingView />
  }

  return (
    <Elements stripe={stripe} options={{ clientSecret }}>
      <StripeForm intent={intent.paymentIntent} onSubmit={onSubmitHandler} onLoading={onLoading} />
      {children}
    </Elements>
  )
}
