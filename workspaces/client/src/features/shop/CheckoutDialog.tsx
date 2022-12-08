/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import {
  Button,
  DialogActions,
  DialogContent,
  Fade,
  Grid,
  Grow,
  Slide,
  Typography,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { TransitionProps } from '@mui/material/transitions'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch } from '../app'
import Checkout from './Checkout'
import ShopCart from './ShopCart'
import { checkoutAsync } from './thunks'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const steps = [<ShopCart key={0} />, <Checkout key={1} />]

export default function CheckoutDialog() {
  const [activeStep, setActiveStep] = React.useState(0)
  const dispatch = useAppDispatch()

  const handleNext = () => {
    setActiveStep(activeStep + 1)
    if (activeStep === steps.length - 1) {
      dispatch(checkoutAsync())
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
    <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
      <DialogContent>
        <Grid item xs={12} textAlign="center" sx={{ mb: 2 }} color="text.secondary">
          <Typography>Shopping</Typography>
        </Grid>
        <ShopCart sx={activeStep === 0 ? {} : { display: 'none' }} />
        <Grow in={activeStep === 1}>
          <div></div>
        </Grow>
        <DialogActions>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
              Back
            </Button>
          )}
          <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
            {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
