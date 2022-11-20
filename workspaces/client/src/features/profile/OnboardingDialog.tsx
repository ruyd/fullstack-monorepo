import { Dialog } from '@mui/material'
import React from 'react'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch } from '../app'

export default function OnboardingDialog() {
  const dispatch = useAppDispatch()
  const requested = useAppSelector(state => state.app.dialog)
  const open = requested === 'onboarding'
  const closeMe = React.useCallback(() => {
    dispatch(patch({ dialog: undefined }))
  }, [dispatch])

  if (!open) {
    return null
  }

  return (
    <Dialog open={open}>
      <div>Profile</div>
      <button onClick={closeMe}>Close</button>
    </Dialog>
  )
}
