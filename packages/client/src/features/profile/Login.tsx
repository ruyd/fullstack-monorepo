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
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { Paths } from 'src/shared/routes'
import { forgotAsync, loginAsync } from '../app/thunks'
import { useAppDispatch } from '../../shared/store'

export default function Login(): JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const returnTo = new URLSearchParams(window.location.search).get('returnTo')
  const emailRef = React.useRef<HTMLInputElement>(null)

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const payload = {} as Record<string, unknown>
    data.forEach((value, key) => (payload[key] = value))
    dispatch(loginAsync(payload)).then(({ meta }) => {
      if (meta.requestStatus === 'fulfilled') {
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

  return (
    <Container maxWidth="xs" className="centered">
      <Box
        sx={{
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
                autoFocus
                inputRef={emailRef}
                autoComplete="email"
                required
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
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
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <MuiLink variant="body2" component={Link} to={''} onClick={forgotHandler}>
                Forgot Password?
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink variant="body2" component={Link} to={`${Paths.Register}${returnTo}`}>
                or Register if new
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
