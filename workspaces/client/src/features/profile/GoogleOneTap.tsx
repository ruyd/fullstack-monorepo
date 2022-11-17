import React from 'react'
import { useAppDispatch } from 'src/shared/store'
import { IdentityToken } from '../../../../lib/src/types'
import config from '../../shared/config'
import decode from 'jwt-decode'
import authProvider from 'auth0-js'

type OneTapBase = {
  context?: 'use' | 'signin' | 'signup'
  callback?: (response: { credential?: string }) => void
}

const initOptions: OneTapParams = {
  client_id: config.auth?.google?.clientId,
  callback: async ok => {
    const token = await authProviderSocialLogin(ok.credential as string)
    // eslint-disable-next-line no-console
    console.log(token)
  },
}

export async function authProviderSocialLogin(credential: string) {
  const email = (decode(credential) as IdentityToken)?.email
  const options = {
    domain: config.auth?.domain as string,
    clientID: config.auth?.clientId as string,
    audience: config.auth?.audience as string,
    redirectUri: config.auth?.redirectUrl as string,
    responseType: 'id_token token',
    connection: 'google-oauth2',
    scope: 'openid profile email',
    loginHint: email,
  }
  const webAuth = new authProvider.WebAuth(options)
  webAuth.popup.authorize(options, () => {
    /* nothing interesting */
  })
}

export interface OneTapParams extends OneTapBase {
  client_id?: string
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
}
export type OneTapAPI = {
  accounts: { id: { initialize: (options: OneTapParams) => void; prompt: () => void } }
}
export type WindowWithGoogle = Window & typeof globalThis & { google: OneTapAPI }

export interface OneTapHookOptions extends OneTapBase {
  clientId?: string
  autoSelect?: boolean
  cancelOnTapOutside?: boolean
  ref?: React.MutableRefObject<OneTapAPI | null>
}

export function loadScriptAndInit({
  clientId,
  autoSelect = false,
  cancelOnTapOutside = true,
  context = 'signin',
  callback,
  ref,
  ...otherOptions
}: OneTapHookOptions): void {
  if (typeof window !== 'undefined' && window.document) {
    const contextValue = ['signin', 'signup', 'use'].includes(context) ? context : 'signin'
    const googleScript = document.createElement('script')
    googleScript.src = 'https://accounts.google.com/gsi/client'
    googleScript.async = true
    googleScript.defer = true
    document.head.appendChild(googleScript)

    window.onload = function () {
      const google = (window as WindowWithGoogle).google
      if (google) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: callback,
          auto_select: autoSelect,
          cancel_on_tap_outside: cancelOnTapOutside,
          context: contextValue,
          ...otherOptions,
        })
        google.accounts.id.prompt()
        if (ref) {
          ref.current = google
        }
      }
    }
  }
}

export const prompt = () => {
  const tap = (window as WindowWithGoogle).google?.accounts?.id
  tap.initialize(initOptions)
  tap.prompt()
}

export function GoogleOneTap({ children }: React.PropsWithChildren): JSX.Element {
  const dispatch = useAppDispatch()
  const loaded = React.useRef(false)
  const ref = React.useRef<OneTapAPI | null>(null)

  React.useEffect(() => {
    if (!loaded.current) {
      loadScriptAndInit({
        ...initOptions,
        ref,
      })
      loaded.current = true
    }
  }, [dispatch, loaded])

  return <>{children}</>
}

export default GoogleOneTap
