/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import config from '../../shared/config'
import authProvider from 'auth0-js'
import { useAppDispatch } from 'src/shared/store'
import Alert from '@mui/material/Alert'
import { AlertTitle, Container } from '@mui/material'

export default function Callback(): JSX.Element {
  const dispatch = useAppDispatch()
  const access_token = new URLSearchParams(window.location.hash).get('#access_token')
  const id_token = new URLSearchParams(window.location.href).get('id_token')
  const error = new URLSearchParams(window.location.hash).get('#error')
  const errorDescription = new URLSearchParams(window.location.href).get('error_description')
  React.useEffect(() => {
    if (access_token) {
      const auth = new authProvider.WebAuth({
        domain: config.auth?.domain as string,
        clientID: config.auth?.clientId as string,
        audience: config.auth?.audience as string,
      })
      console.log('access_token', access_token, id_token)
      //   auth.popup.callback({
      //     hash: window.location.hash,
      //   })
    }
  }, [dispatch, access_token, id_token])

  if (error) {
    return (
      <Container className="centered">
        <Alert severity="error">
          <AlertTitle>{errorDescription}</AlertTitle>
        </Alert>
      </Container>
    )
  }

  return <></>
}
