/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  Grow,
  Slide,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { TransitionProps } from '@mui/material/transitions'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch } from '../app'
import Checkout from './Checkout'
import ShopCart from './ShopCart'
import { checkoutAsync } from './thunks'
import PaymentForm from './PaymentForm'
import Review from './Review'
import AddressForm from './AddressForm'
import Receipt from './Receipt'
import StripePay from './StripePay'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const steps: { title: string; component: JSX.Element; next: string }[] = [
  { title: 'Cart', component: <ShopCart />, next: 'Checkout' },
  { title: 'Billing address', component: <AddressForm />, next: 'Continue' },
  { title: 'Payment details', component: <PaymentForm />, next: 'Continue' },
  { title: 'Review your order', component: <Review />, next: 'Place Order' },
  { title: 'Confirmation', component: <Receipt />, next: 'Close' },
]

export default function CheckoutDialog() {
  const [activeStep, setActiveStep] = React.useState(0)
  const dispatch = useAppDispatch()

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
    if (activeStep === Object.keys(steps).length - 1) {
      setActiveStep(0)
      dispatch(patch({ dialog: undefined }))
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const requested = useAppSelector(state => state.app.dialog)
  const [show, setShow] = React.useState('checkout')
  const open = requested?.includes('checkout')
  const handleClose = React.useCallback(() => {
    dispatch(patch({ dialog: undefined }))
  }, [dispatch])

  React.useEffect(() => {
    setShow(requested?.split('.')[1] || 'checkout')
  }, [requested, setShow])

  if (!open) {
    return null
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth={false}
      sx={{ m: '5rem' }}
      fullScreen
    >
      <DialogContent>
        <Stepper
          activeStep={activeStep === steps.length - 1 ? activeStep + 1 : activeStep}
          sx={{ pt: 3, pb: 5 }}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {/* <Grid item xs={12} textAlign="center" sx={{ mb: 2 }} color="text.secondary">
          <Typography>Shopping</Typography>
        </Grid> */}
        {steps[activeStep]?.component}
      </DialogContent>
      <DialogActions>
        {activeStep > 0 && activeStep < steps.length - 1 && (
          <Button onClick={handleBack} sx={{ ml: 1 }}>
            Back
          </Button>
        )}
        <Button variant="contained" onClick={handleNext} sx={{ ml: 1 }}>
          {steps[activeStep].next}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
