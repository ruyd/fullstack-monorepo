import React from 'react'
import Alert from '@mui/material/Alert'
import { AlertTitle, Container } from '@mui/material'
import authProvider from 'auth0-js'
import { authOptions, getNonce } from 'src/shared/auth'

export default function Callback(): JSX.Element {
  const access_token = new URLSearchParams(window.location.hash).get('#access_token')
  const id_token = new URLSearchParams(window.location.href).get('id_token')
  const state = new URLSearchParams(window.location.href).get('state') as string
  const error = new URLSearchParams(window.location.hash).get('#error')
  const errorDescription = new URLSearchParams(window.location.href).get('error_description')
  React.useEffect(() => {
    const parseCallback = async () => {
      const { state, nonce } = getNonce()
      const options = { ...authOptions(), state, nonce }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  }, [access_token, id_token, state])

  if (error) {
    return (
      <Container className="centered">
        <Alert severity="error">
          <AlertTitle>{errorDescription}</AlertTitle>
        </Alert>
      </Container>
    )
  }

  return (
    <Container>
      <h1 className="centered">Authenticating...</h1>
    </Container>
  )
}
