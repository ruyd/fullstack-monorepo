import { DialogActions, DialogContent } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import React from 'react'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch } from '../app'
import Login from './Login'
import Register from './Register'

export default function OnboardingDialog() {
  const dispatch = useAppDispatch()
  const requested = useAppSelector(state => state.app.dialog)
  const [show, setShow] = React.useState('login')
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
        <Login className={show === 'login' ? '' : 'hidden'} />
        <Register className={show === 'login' ? '' : 'hidden'} />
        <DialogActions>
          <button onClick={() => setShow('login')}>Login</button>
          <button onClick={() => setShow('register')}>Register</button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
