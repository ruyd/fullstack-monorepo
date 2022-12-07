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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function OnboardingDialog() {
  const dispatch = useAppDispatch()
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
      <Checkout />
    </Dialog>
  )
}