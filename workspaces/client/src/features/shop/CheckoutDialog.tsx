/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import {
  Box,
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
  useTheme,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { TransitionProps } from '@mui/material/transitions'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch } from '../app'
import ShopCart from './ShopCart'
import { checkoutAsync, loadAsync } from './thunks'
import PaymentForm from './PaymentForm'
import Review from './Review'
import AddressForm from './AddressForm'
import Receipt from './Receipt'
import StripePay from './StripePay'
import Items from '../canvas/Items'

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
  { title: 'Address', component: <AddressForm />, next: 'Continue' },
  { title: 'Payment', component: <PaymentForm />, next: 'Continue' },
  { title: 'Review', component: <Review />, next: 'Place Order' },
  { title: 'Confirmation', component: <Receipt />, next: 'Close' },
]

export default function CheckoutDialog() {
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState(0)
  const dispatch = useAppDispatch()
  const items = useAppSelector(store => store.shop.items)

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
    if (activeStep === Object.keys(steps).length - 1) {
      setActiveStep(0)
      dispatch(patch({ dialog: undefined }))
      dispatch(checkoutAsync())
    }
  }

  const handleBack = () => {
    if (activeStep === 0) {
      dispatch(patch({ dialog: undefined }))
      return
    }
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
  React.useEffect(() => {
    dispatch(loadAsync())
  }, [dispatch])

  if (!open) {
    return null
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth={false}
      sx={{ m: '3vw 2vw 0 2vw' }}
      fullScreen
    >
      <DialogContent sx={{ backgroundColor: 'background.paper' }}>
        {/* <Grid item xs={12} textAlign="center" sx={{ m: '-.5rem 0 .5rem 0' }} color="text.secondary">
          <Typography>Shopping</Typography>
        </Grid> */}
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
                onClick={() => (index < steps.length - 1 ? setActiveStep(index) : null)}
              >
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Box sx={{ mt: 2 }}>{steps[activeStep]?.component}</Box>
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
          disabled={!items.length}
        >
          {steps[activeStep].next}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
