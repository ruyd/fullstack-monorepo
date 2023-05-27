import React from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { editProfileAsync } from '../app/thunks'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

export default function Profile() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(store => store.app.user)

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const payload = {} as Record<string, unknown>
    data.forEach((value, key) => (payload[key] = value))
    dispatch(editProfileAsync(payload))
  }
  return (
    <Container maxWidth="xs" className="centered">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box component="form" sx={{ mt: 3 }} onSubmit={submitHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                autoComplete="given-name"
                required
                fullWidth
                id="firstName"
                name="firstName"
                label="First name"
                defaultValue={user?.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="family-name"
                required
                fullWidth
                id="lastName"
                name="lastName"
                label="Last name"
                defaultValue={user?.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="email"
                required
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                defaultValue={user?.email}
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
