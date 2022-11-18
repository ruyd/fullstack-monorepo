/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import React from 'react'
import { useAppDispatch } from 'src/shared/store'
import Alert from '@mui/material/Alert'
import { AlertTitle, Container } from '@mui/material'
import { socialLoginAsync } from '../app'
import { getAuthProvider } from 'src/shared/auth'

export default function Callback(): JSX.Element {
  const dispatch = useAppDispatch()
  const access_token = new URLSearchParams(window.location.hash).get('#access_token')
  const id_token = new URLSearchParams(window.location.href).get('id_token')
  const error = new URLSearchParams(window.location.hash).get('#error')
  const errorDescription = new URLSearchParams(window.location.href).get('error_description')
  React.useEffect(() => {
    const parseCallback = async () => {
      //await dispatch(socialLoginAsync({ access_token, id_token }))
      window.opener.postMessage({
        type: 'social',
        access_token: access_token,
        id_token: id_token,
        href: window.location.href,
        hash: window.location.hash,
      })
      const auth = getAuthProvider()
      auth.popup.callback({
        hash: window.location.hash,
      })
    }
    if (access_token && id_token) {
      parseCallback()
    }
    parseCallback()
  }, [access_token, id_token])

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
