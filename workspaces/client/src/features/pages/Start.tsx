import {
  Alert,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import StartImage from './images/start.svg'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { User } from '@lib'
import React from 'react'
import { patch, request } from '../app'
import { onLogin } from 'src/shared/auth'
import loadConfig from 'src/shared/loadConfig'
import { useNavigate } from 'react-router-dom'

export default function StartPage() {
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const loading = useAppSelector(state => state.app.loading)
  const token = useAppSelector(state => state.app.token)
  const ready = useAppSelector(state => state.app.ready)
  const [error, setError] = React.useState<string | null>(null)
  const [form, setForm] = React.useState<{ email: string }>({
    email: '',
  })
  const submitHanlder = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await request<{ ok: boolean; token: string; user: User; error?: string }>(
      'start',
      {
        email: form.email,
      },
      'post',
      {
        validateStatus: () => true,
      },
    )
    if (response.data.ok) {
      dispatch(patch({ token: response.data.token, user: response.data.user }))
      onLogin(response.data)
      await loadConfig()
    } else {
      setError(response.data.error || 'Unknown error')
    }
  }

  React.useEffect(() => {
    if (ready && token) {
      nav('/admin/settings')
    }
  }, [nav, ready, token])

  // send request create internal setting with admin email
  // create token with admin roles
  // if success redirect to admin page
  return (
    <Paper
      sx={{
        flex: 1,
        borderRadius: 0,
        display: 'flex',
        backgroundImage: `url(${StartImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '70%',
        backgroundPosition: 'left bottom',
      }}
    >
      <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={submitHanlder}>
          <Card sx={{ p: '2rem 3rem 2rem 3rem', borderRadius: '16px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
                Empty Database
              </Typography>
              <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Please enter the first admin&apos;s email:
              </Typography>
              <TextField
                autoFocus
                label="Email"
                type="email"
                fullWidth
                variant="filled"
                required
                inputProps={{ sx: { fontSize: '1.5rem' } }}
                value={form.email}
                onChange={e => setForm(current => ({ ...current, email: e.target.value }))}
              />
              {error && (
                <Alert variant="outlined" color="error" sx={{ color: 'red', mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
            <CardActions>
              <LoadingButton
                loading={loading}
                variant="contained"
                fullWidth
                size="large"
                loadingIndicator="Initializing..."
                type="submit"
              >
                Start
              </LoadingButton>
            </CardActions>
          </Card>
        </form>
      </Grid>
    </Paper>
  )
}
