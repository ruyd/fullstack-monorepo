/* eslint-disable no-console */
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
          shape?: 'rectangular' | 'pill'
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
      console.log('window.onload')
      const google = (window as WindowWithGoogle).google
      console.log('google', google)
      if (google) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: callback,
          auto_select: autoSelect,
          cancel_on_tap_outside: cancelOnTapOutside,
          context: contextValue,
          ...otherOptions,
        })
        //google.accounts.id.setLogLevel('info')
        google.accounts.id.prompt()
      }
    }
  }
}

export const prompt = () => {
  const tap = (window as WindowWithGoogle).google?.accounts?.id
  // eslint-disable-next-line no-console
  console.log('tap', tap)
  if (!tap) {
    throw new Error('Google One Tap not initialized')
  }
  tap.initialize(initOptions)
  tap.prompt()
}

export const renderButton = (id: string) => {
  const tap = (window as WindowWithGoogle).google?.accounts?.id
  if (!tap || !id) {
    throw new Error('Google One Tap not initialized')
  }
  tap.initialize(initOptions)
  const el = document.getElementById(id)
  if (!el) {
    throw new Error(`Element with id ${id} not found`)
  }
  tap.renderButton(el, {
    type: 'standard',
    shape: 'pill',
    text: 'continue_with',
    theme: store.getState().app.darkTheme ? 'filled_black' : 'outline',
    size: 'large',
  })
}

export function GoogleOneTapButton({
  id = 'one-tap-button',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { id?: string }) {
  const google = (window as WindowWithGoogle).google
  React.useEffect(() => {
    renderButton(id)
  }, [google, id])

  return <div id={id} {...props}></div>
}
export function GoogleOneTap(): JSX.Element {
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.app.token)
  React.useEffect(() => {
    if (!token) {
      loadScriptAndInit({
        ...initOptions,
      })
    }
  }, [dispatch, token])

  return <></>
}

export default GoogleOneTap
