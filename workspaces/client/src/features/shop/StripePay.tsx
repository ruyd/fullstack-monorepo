/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { v4 as uuid } from 'uuid'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { PaymentIntent, PaymentIntentResult, StripePaymentElementOptions } from '@stripe/stripe-js'
import styled from '@emotion/styled'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { Payment, PaymentSource, StripeToPaymentStatusMap } from '@lib'
import { Box, Button, CircularProgress, Typography } from '@mui/material'

function ReceiptView({ id }: { id?: string }): JSX.Element {
  return (
    <div>
      <h2 className="my-5">Your order was placed succesfully!</h2>
      <div className="success-checkmark">
        <div className="check-icon">
          <span className="icon-line line-tip"></span>
          <span className="icon-line line-long"></span>
          <div className="icon-circle"></div>
          <div className="icon-fix"></div>
        </div>
      </div>
      <h3>reference #: {id}</h3>
    </div>
  )
}

const formatPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format.bind({})

export function StripePay({
  intent,
  onSubmit,
  onLoading,
}: {
  intent?: Partial<PaymentIntent>
  onSubmit?: () => void
  onLoading?: (loading: boolean) => void
}) {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.app.user)
  const activeProductPurchase = useAppSelector(state => state.shop.activeItem)
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
  const price = formatPrice(activeProductPurchase?.price || 0)
  React.useEffect(() => {
    if (onLoading) {
      onLoading(isLoading)
    }
  }, [isLoading, onLoading])

  const handleSubmit = async (e: any) => {
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
        // const paymentDetails: Payment = {
        //   paymentId: uuid(),
        //   userId: user?.userId as string,
        //   amount: activeItem?.price || 0,
        //   currency: intent?.currency || 'USD',
        //   status: StripeToPaymentStatusMap[res.paymentIntent?.status || 'unknown'],

        // }
        // await dispatch(onChargeApprovedAsync(paymentDetails))
        if (onSubmit) {
          setTimeout(() => onSubmit(), 3000)
        }
      }
    } catch (error: any) {
      setMessage(error.message)
      return
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box>
      <form id="payment-form" onSubmit={handleSubmit}>
        {isLoading && <CircularProgress />}
        {result && <ReceiptView id={result.paymentIntent?.id} />}
        {!result && (
          <>
            {!isLoading && (
              <>
                <Typography>Total Charges: {price}</Typography>
                <h2 className="my-5">Please enter your payment details</h2>
              </>
            )}
            {message && <Typography>{message}</Typography>}
            <PaymentElement options={elementOptions} />
            <Button disabled={isLoading} type="submit" fullWidth>
              <span id="button-text">{isLoading ? 'Paying...' : 'Pay now'}</span>
            </Button>
          </>
        )}
      </form>
    </Box>
  )
}

export default StripePay
