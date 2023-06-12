import React from 'react'
import Dialog from '@mui/material/Dialog'
import { TransitionProps } from '@mui/material/transitions'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { patch } from '../app'
import Login from './Login'
import Register from './Register'
import { GoogleOneTapButton } from './GoogleOneTap'
import Spacer from '../ui/Spacer'
import Slide from '@mui/material/Slide'
import DialogContent from '@mui/material/DialogContent'
import Grow from '@mui/material/Grow'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { sendEvent } from 'src/shared/firebase'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
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
    sendEvent('onboarding.cancel', {
      action: 'manualClose'
    })
  }, [dispatch])

  React.useEffect(() => {
    setShow(requested?.split('.')[1] || 'login')
    sendEvent('onboarding.show')
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
        {enableRegistration && (
          <DialogActions>
            <GoogleOneTapButton style={{ marginBottom: '-5px' }} />
            <Spacer />
            <Button variant="outlined" onClick={() => setShow('login')}>
              Sign in
            </Button>
            <Button variant="outlined" onClick={() => setShow('register')}>
              Sign up
            </Button>
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  )
}
