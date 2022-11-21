import React from 'react'
import store, { useAppDispatch, useAppSelector } from 'src/shared/store'
import { IdentityToken } from '../../../../lib/src/types'
import config from '../../shared/config'
import decode from 'jwt-decode'
import authProvider from 'auth0-js'
import { authOptions, checkSocialToken, generateNonce } from 'src/shared/auth'
import { notifyError, socialLoginAsync } from '../app'

type OneTapBase = {
  context?: 'use' | 'signin' | 'signup'
  callback?: (response: { credential?: string }) => void
}

export const initOptions: OneTapParams = {
  client_id: config.auth?.google?.clientId,
  callback: async ok => {
    googleCredentialsLogin(ok.credential as string)
    /* response.credential should be enough for google cloud backends,
    using Callback.tsx for auth0 */
  },
}
export interface OneTapParams extends OneTapBase {
  client_id?: string
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
}
/**
 * https://developers.google.com/identity/gsi/web/reference/js-reference#GsiButtonConfiguration
 */
export type OneTapAPI = {
  accounts: {
    id: {
      initialize: (options: OneTapParams) => void
      prompt: (
        callback?: (notification: {
          isNotDisplayed: () => void
          isSkippedMoment: () => void
        }) => void,
      ) => void
      setLogLevel: (l: 'info' | 'none') => void
      renderButton: (
        e: HTMLElement,
        options?: {
          text?: 'signin' | 'signin_with' | 'continue_with' | 'signup_with'
          type?: 'standard' | 'icon'
          theme?: 'outline' | 'filled_blue' | 'filled_black'
          size?: 'small' | 'medium' | 'large'
        },
      ) => void
    }
  }
}
export type WindowWithGoogle = Window & typeof globalThis & { google: OneTapAPI }

export interface OneTapHookOptions extends OneTapBase {
  clientId?: string
  autoSelect?: boolean
  cancelOnTapOutside?: boolean
  ref?: React.MutableRefObject<OneTapAPI | null>
}

export async function googleCredentialsLogin(credential: string) {
  const email = (decode(credential) as IdentityToken)?.email
  const userId = await checkSocialToken(credential)
  googlePopupLogin(email, userId)
}

export async function googlePopupLogin(email?: string, userId?: string): Promise<void> {
  const session = generateNonce(userId)
  const options = {
    ...authOptions(),
    connection: 'google-oauth2',
    loginHint: email,
    state: session.state,
    nonce: session.nonce,
    appUserId: userId,
  }
  const auth = new authProvider.WebAuth(options)
  auth.popup.authorize(options, (err, result) => {
    if (err) {
      store.dispatch(notifyError(err.description as string))
      return
    }
    const { accessToken, idToken } = result
    store.dispatch(socialLoginAsync({ accessToken, idToken }))
  })
}

export function loadScriptAndInit({
  clientId,
  autoSelect = false,
  cancelOnTapOutside = true,
  context = 'signin',
  callback,
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
        google.accounts.id.setLogLevel('info')
        google.accounts.id.initialize({
          client_id: clientId,
          callback: callback,
          auto_select: autoSelect,
          cancel_on_tap_outside: cancelOnTapOutside,
          context: contextValue,
          ...otherOptions,
        })
        // eslint-disable-next-line no-console
        google.accounts.id.prompt(notification => console.log('prompt', notification))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        google.accounts.id.renderButton(document.getElementById('one-tap-button')!, {
          text: 'continue_with',
          theme: 'outline',
          size: 'large',
        })
      }
    }
  }
}

export const prompt = () => {
  const tap = (window as WindowWithGoogle).google?.accounts?.id
  // eslint-disable-next-line no-console
  console.log('tap', tap)
  if (!tap) {
    // eslint-disable-next-line no-console
    console.error('Google One Tap not initialized')
  }
  tap.initialize(initOptions)
  tap.prompt()
}

export const renderButton = (id: string) => {
  const tap = (window as WindowWithGoogle).google?.accounts?.id
  if (!tap) {
    // eslint-disable-next-line no-console
    console.error('Google One Tap not initialized')
  }
  tap.initialize(initOptions)
  const el = document.getElementById(id)
  if (!el) return
  tap.renderButton(el, {
    text: 'continue_with',
    theme: 'outline',
    size: 'large',
  })
}

export const GoogleOneTapButton = ({ id = 'one-tap-button' }: { id?: string }) => {
  const google = (window as WindowWithGoogle).google
  React.useEffect(() => {
    renderButton(id)
  }, [google, id])

  return <div id={id}></div>
}
export function GoogleOneTap(): JSX.Element {
  const dispatch = useAppDispatch()
  const loaded = React.useRef(false)
  const token = useAppSelector(state => state.app.token)
  React.useEffect(() => {
    if (!loaded.current && !token) {
      loadScriptAndInit({
        ...initOptions,
      })
      loaded.current = true
    }
  }, [dispatch, loaded, token])

  return <></>
}

export default GoogleOneTap
