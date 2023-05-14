/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Slide,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import type { TransitionProps } from '@mui/material/transitions'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { patch } from './slice'
import { patch as patchApp, useGet } from '../app'
import ShopCart from './ShopCart'
import { loadAsync } from './thunks'
import PaymentStep from './Payment'
import AddressStep from './Address'
import ReceiptStep from './Receipt'
import Products from './Products'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const stepsBase: Array<{ title: string; component: JSX.Element; next: string; key: string }> = [
  { title: 'Subscription', component: <Products />, next: 'Checkout', key: 'plan' },
  { title: 'Payment', component: <PaymentStep />, next: 'Continue', key: 'payment' },
  { title: 'Receipt', component: <ReceiptStep />, next: 'Close', key: 'receipt' },
]

export default function SubscribeDialog() {
  const token = useAppSelector(state => state.app.token)
  const activeStep = useAppSelector(state => state.shop.activeStep)
  const stepsStatus = useAppSelector(state => state.shop.steps)
  const dispatch = useAppDispatch()
  const loaded = useAppSelector(state => state.shop.loaded)

  const enableShippingAddress = useAppSelector(
    state => state.app.settings?.system?.enableShippingAddress,
  )
  const enableIdentity = useAppSelector(
    state => state.app.settings?.system?.paymentMethods?.stripe?.identityEnabled,
  )
  const steps = stepsBase
    .filter(a => enableShippingAddress || a.key !== 'address')
    .filter(a => enableIdentity || a.key !== 'identity')

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      dispatch(patch({ activeStep: activeStep + 1 }))
    }
    if (activeStep === Object.keys(steps).length - 1) {
      dispatch(patch({ activeStep: 0, receipt: undefined }))
      dispatch(patchApp({ dialog: undefined }))
    }
  }

  const handleBack = () => {
    if (activeStep === 0) {
      dispatch(patchApp({ dialog: undefined }))
      return
    }
    dispatch(patch({ activeStep: activeStep - 1 }))
  }

  const requested = useAppSelector(state => state.app.dialog)
  const open = requested === 'subscribe'
  const handleClose = React.useCallback(() => {
    dispatch(patchApp({ dialog: undefined }))
  }, [dispatch])

  if (!open) {
    return <></>
  }

  return (
    <Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth={false}
        sx={{ m: '3vw 2vw 0 2vw' }}
        fullScreen
      >
        <DialogContent
          sx={{ backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column' }}
        >
          <Grid container>
            <Stepper
              activeStep={activeStep === steps.length - 1 ? activeStep + 1 : activeStep}
              sx={{
                display: 'flex',
                flex: 1,
                flexWrap: 'wrap',
              }}
            >
              {steps.map((step, index) => (
                <Step
                  key={index}
                  sx={{ m: '.3rem .7rem', cursor: 'pointer' }}
                  onClick={() =>
                    index < steps.length - 1 ? dispatch(patch({ activeStep: index })) : null
                  }
                >
                  <StepLabel>{step.title}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', flex: 1 }}>{steps[activeStep]?.component}</Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: 'background.paper' }}>
          {activeStep < steps.length - 1 && (
            <Button onClick={handleBack} sx={{ ml: 1 }} size="large">
              {activeStep === 0 ? 'Close' : 'Back'}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ ml: 1 }}
            size="large"
            disabled={!stepsStatus[steps[activeStep].key]}
          >
            {steps[activeStep].next}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
