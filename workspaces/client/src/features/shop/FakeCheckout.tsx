import React, { useEffect } from 'react'

import { PaymentIntentResult, PaymentIntent } from '@stripe/stripe-js'
import { useAppDispatch } from '../../shared/store'

import { CircularProgress } from '@mui/material'

import { checkoutAsync } from './thunks'

export default function FakeCheckout({}: React.PropsWithChildren<{
  onApproval?: (result: PaymentIntentResult) => void
  onLoading?: () => void
}>): JSX.Element {
  const dispatch = useAppDispatch()

  useEffect((): void => {
    dispatch(
      checkoutAsync({
        paymentIntent: {
          amount: 111
        } as PaymentIntent
      })
    )
  }, [dispatch])

  return <CircularProgress />
}
