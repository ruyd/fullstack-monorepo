import { LockOutlined } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { LoginAsync } from '../features/app/thunks'
import { useAppDispatch } from '../shared/store'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const returnTo = new URLSearchParams(window.location.search).get('returnTo')

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const payload = {} as Record<string, unknown>
    data.forEach((value, key) => (payload[key] = value))
    dispatch(LoginAsync(payload)).then(({ meta }) => {
      if (meta.requestStatus === 'fulfilled') {
        navigate(returnTo || '/')
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
          Sign in
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={submitHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
