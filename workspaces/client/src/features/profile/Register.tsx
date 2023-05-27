import { LockOutlined } from '@mui/icons-material'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { registerAsync } from '../app/thunks'
import { Paths } from '../../shared/routes'
import { loginWithGoogle } from './GoogleOneTap'
import LoadingButton from '@mui/lab/LoadingButton'
import PasswordField from '../ui/PasswordField'
import Container, { ContainerProps } from '@mui/material/Container'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

export default function Register(props?: ContainerProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const returnPath = new URLSearchParams(window.location.search).get('returnTo')
  const returnTo = returnPath ? `?returnTo=${returnPath}` : ''
  const isRoutedPage = window.location.pathname.toLowerCase().includes('register')
  const isLoading = useAppSelector(state => state.app.loading)

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const obj = {} as Record<string, unknown>
    data.forEach((value, key) => (obj[key] = value))
    dispatch(registerAsync(obj)).then(({ meta }) => {
      if (meta.requestStatus === 'fulfilled') {
        navigate(`${Paths.Login}${returnTo}`)
      }
    })
  }

  return (
    <Container maxWidth="xs" {...props}>
      <Box
        sx={{
          minHeight: '44vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        <Box component="form" sx={{ mt: 3 }} onSubmit={submitHandler} autoComplete="on">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                required
                fullWidth
                id="firstName"
                name="firstName"
                label="First name"
                autoComplete="given-name"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                name="lastName"
                label="Last name"
                autoComplete="family-name"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="registerEmail"
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                required
                fullWidth
                id="password"
                name="password"
                label="Password"
                autoComplete="new-password"
                variant="filled"
              />
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 1.5 }}
            loading={isLoading}
          >
            Sign Up
          </LoadingButton>
          {isRoutedPage && (
            <Button
              component={Link}
              to={`${Paths.Login}${returnTo}`}
              onClick={() => loginWithGoogle()}
              fullWidth
            >
              Already have an account? Sign in
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  )
}
