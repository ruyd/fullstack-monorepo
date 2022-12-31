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
import Login from './Login'
import Register from './Register'
import { GoogleOneTapButton } from './GoogleOneTap'
import Spacer from '../ui/Spacer'

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
  const enableRegistration = useAppSelector(state => state.app.settings?.system?.enableRegistration)
  const requested = useAppSelector(state => state.app.dialog)
  const [show, setShow] = React.useState('login')
  const open = requested?.includes('onboard')
  const handleClose = React.useCallback(() => {
    dispatch(patch({ dialog: undefined }))
  }, [dispatch])

  React.useEffect(() => {
    setShow(requested?.split('.')[1] || 'login')
  }, [requested, setShow])

  if (!open) {
    return null
  }

  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
      <DialogContent>
        <Login sx={show === 'login' ? {} : { display: 'none' }} />
        <Grow in={show === 'register'}>
          <div>
            <Register sx={show === 'register' ? {} : { display: 'none' }} />
          </div>
        </Grow>
        <Grid item xs={12} textAlign="center" sx={{ mb: 2 }} color="text.secondary">
          <Typography>To save drawings you need an account</Typography>
          <Typography variant="body2">*By using this site you agree to it&apos;s terms</Typography>
        </Grid>
        <DialogActions>
          <GoogleOneTapButton style={{ marginBottom: '-5px' }} />
          <Spacer />
          <Button variant="outlined" onClick={() => setShow('login')}>
            Sign in
          </Button>
          {enableRegistration && (
            <Button variant="outlined" onClick={() => setShow('register')}>
              Sign up
            </Button>
          )}
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
