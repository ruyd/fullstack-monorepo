import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Link as MuiLink,
  Container,
} from '@mui/material'
import { LockOutlined } from '@mui/icons-material'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../shared/store'
import { registerAsync } from '../app/thunks'
import { Paths } from 'src/shared/routes'

export default function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const returnPath = new URLSearchParams(window.location.search).get('returnTo')
  const returnTo = returnPath ? `?returnTo=${returnPath}` : ''

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
          Sign up
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={submitHandler} autoComplete="on">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="firstName"
                name="firstName"
                label="First name"
                autoFocus
                autoComplete="given-name"
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="acceptTerms" color="primary" />}
                label="I accept the terms"
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <MuiLink component={Link} to={`${Paths.Login}${returnTo}`} variant="body2">
                Already have an account? Sign in
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
