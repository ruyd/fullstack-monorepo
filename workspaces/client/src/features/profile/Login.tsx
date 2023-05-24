import React from 'react'
import { LockOutlined } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Link as MuiLink,
  ContainerProps
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { Paths } from '../../shared/routes'
import { forgotAsync, loginAsync } from '../app/thunks'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import PasswordField from '../ui/PasswordField'
import { oAuthInputs } from '../../../../lib/src/types'
import LoadingButton from '@mui/lab/LoadingButton'

export default function Login(props?: ContainerProps & Partial<React.Component>): JSX.Element {
  const enableRegistration = useAppSelector(state => state.app.settings?.system?.enableRegistration)
  const enableAuth = useAppSelector(state => state.app.settings?.auth0?.enabled)
  const token = useAppSelector(state => state.app.token)
  const loading = useAppSelector(state => state.app.loading)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const returnPath = new URLSearchParams(window.location.search).get('returnTo')
  const returnTo = returnPath ? `?returnTo=${returnPath}` : ''
  const isRoutedPage = window.location.pathname.toLowerCase().includes('login')
  const emailRef = React.useRef<HTMLInputElement>(null)

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const payload = {} as oAuthInputs
    data.forEach((value, key) => (payload[key] = value as string))

    dispatch(loginAsync(payload)).then(({ meta }) => {
      if (meta.requestStatus === 'fulfilled' && (returnTo || isRoutedPage)) {
        navigate(returnTo || '/')
      }
    })
  }

  const forgotHandler = () => {
    emailRef.current?.reportValidity()
    if (emailRef.current?.validity.valid && emailRef.current?.value) {
      dispatch(forgotAsync({ email: emailRef.current?.value }))
    }
  }

  React.useEffect(() => {
    if (token) {
      navigate(returnTo || '/')
    }
  }, [dispatch, navigate, returnTo, token])

  return (
    <Container maxWidth="xs" sx={{ flex: 1, display: 'flex' }} {...props}>
      <Box
        sx={{
          flex: 1,
          minHeight: '44vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 5
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={submitHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                inputRef={emailRef}
                autoComplete="email"
                required
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                variant="filled"
                placeholder="Email"
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                autoComplete="current-password"
                required
                fullWidth
                name="password"
                label="Password"
                variant="filled"
                placeholder="Password"
              />
            </Grid>
          </Grid>
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Sign In
          </LoadingButton>
          {enableAuth && (
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              sx={{ mt: 1, mb: 2 }}
              onClick={forgotHandler}
            >
              Forgot Password?
            </Button>
          )}
          {enableRegistration && (
            <Grid container justifyContent="flex-end" spacing={1}>
              {isRoutedPage && (
                <Grid item>
                  <MuiLink variant="body2" component={Link} to={`${Paths.Register}${returnTo}`}>
                    or Register if new
                  </MuiLink>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  )
}
