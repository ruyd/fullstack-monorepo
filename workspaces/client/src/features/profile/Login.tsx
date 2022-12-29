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
  ContainerProps,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { Paths } from 'src/shared/routes'
import { forgotAsync, loginAsync } from '../app/thunks'
import { useAppDispatch, useAppSelector } from '../../shared/store'

export default function Login(props?: ContainerProps & Partial<React.Component>): JSX.Element {
  const token = useAppSelector(state => state.app.token)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const returnPath = new URLSearchParams(window.location.search).get('returnTo')
  const returnTo = returnPath ? `?returnTo=${returnPath}` : ''
  const isRoutedPage = window.location.pathname.toLowerCase().includes('login')
  const emailRef = React.useRef<HTMLInputElement>(null)

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const payload = {} as Record<string, unknown>
    data.forEach((value, key) => (payload[key] = value))
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
    <Container maxWidth="xs" {...props}>
      <Box
        sx={{
          minHeight: '44vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
                inputRef={emailRef}
                autoComplete="email"
                required
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="current-password"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                variant="filled"
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
            Sign In
          </Button>
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
          <Grid container justifyContent="flex-end" spacing={1}>
            {isRoutedPage && (
              <Grid item>
                <MuiLink variant="body2" component={Link} to={`${Paths.Register}${returnTo}`}>
                  or Register if new
                </MuiLink>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
