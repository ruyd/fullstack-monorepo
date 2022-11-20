import { DialogContent } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import React from 'react'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch } from '../app'
import Login from './Login'

export default function OnboardingDialog() {
  const dispatch = useAppDispatch()
  const requested = useAppSelector(state => state.app.dialog)
  const open = requested === 'onboard'
  const handleClose = React.useCallback(() => {
    dispatch(patch({ dialog: undefined }))
  }, [dispatch])

  if (!open) {
    return null
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Login />
      </DialogContent>
    </Dialog>
  )
}
