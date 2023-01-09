import React from 'react'
import Alert from '@mui/material/Alert'
import { AlertTitle, Box, Grid, LinearProgress, Paper, Typography } from '@mui/material'
import authProvider from 'auth0-js'
import { authOptions, getNonce } from 'src/shared/auth'
import loginImage from './images/login.svg'
import { useAppSelector } from 'src/shared/store'

export default function Callback(): JSX.Element {
  const clientId = useAppSelector(state => state.app.settings?.auth0?.clientId)
  const access_token = new URLSearchParams(window.location.hash).get('#access_token')
  const id_token = new URLSearchParams(window.location.href).get('id_token')
  const state = new URLSearchParams(window.location.href).get('state') as string
  const error = new URLSearchParams(window.location.hash).get('#error')
  const errorDescription = new URLSearchParams(window.location.href).get('error_description')
  React.useEffect(() => {
    const parseCallback = async () => {
      const { state, nonce } = getNonce()
      const options = { ...authOptions(), state, nonce, clientId }
      const webAuth = new authProvider.WebAuth(options)
      webAuth.popup.callback({
        hash: window.location.hash,
        state,
        nonce,
      })
    }
    if (access_token && id_token) {
      parseCallback()
    }
    parseCallback()
  }, [access_token, id_token, state, clientId])

  return (
    <Paper sx={{ height: '100vh' }}>
      <Grid container justifyContent="center" alignContent="center" height="100vh">
        <Grid item textAlign="center">
          {error && (
            <Alert severity="error">
              <AlertTitle>{errorDescription}</AlertTitle>
            </Alert>
          )}
          <Typography variant="h3" component="h1">
            Signing in...
          </Typography>
          <img src={loginImage} height={370} width={450} />
        </Grid>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </Grid>
    </Paper>
  )
}
