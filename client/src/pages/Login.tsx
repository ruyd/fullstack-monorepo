import { LockOutlined } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
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

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const obj = {} as any
    data.forEach((value, key) => (obj[key] = value))
    dispatch(LoginAsync(obj)).then(({ meta }) => {
      if (meta.requestStatus === 'fulfilled') {
        navigate('/')
      }
    })
  }
  return (
    <Container maxWidth="xs">
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
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
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
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
