/* eslint-disable no-console */
import React from 'react'
import store, { useAppDispatch, useAppSelector } from '../../shared/store'
import { IdentityToken } from '../../../../lib/src/types'
import decode from 'jwt-decode'
import authProvider from 'auth0-js'
import { authOptions, checkSocialToken, generateNonce } from '../../shared/auth'
import { notifyError, socialLoginAsync } from '../app'

type OneTapBase = {
  context?: 'use' | 'signin' | 'signup'
  callback?: (response: { credential?: string }) => void
}

export const initOptions: OneTapParams = {
  callback: async ok => {
    console.log('Google One Tap callback', ok)
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
  if (typeof window !== 'undefined') {
    const contextValue = ['signin', 'signup', 'use'].includes(context) ? context : 'signin'
    const googleScript = document.createElement('script')
    googleScript.src = 'https://accounts.google.com/gsi/client'
    googleScript.async = true
    googleScript.defer = true
    document.head.appendChild(googleScript)
    let initialized = false
    const runInit = () => {
      if (initialized) {
        console.log('Google One Tap already initialized')
        return
      }
      console.log('runInit')
      const google = (window as WindowWithGoogle).google
      if (google) {
        initialized = true
        google.accounts.id.setLogLevel('info')
        google.accounts.id.initialize({
          client_id: clientId,
          callback: callback,
          auto_select: autoSelect,
          cancel_on_tap_outside: cancelOnTapOutside,
          context: contextValue,
          ...otherOptions,
        })
        google.accounts.id.prompt(notification =>
          console.log('Google One Tap prompt', notification),
        )
      }
    }
    runInit()
    googleScript.onload = runInit
    window.onload = runInit
  }
}

export const renderButton = (el: HTMLElement) => {
  const tap = (window as WindowWithGoogle).google?.accounts?.id
  if (!tap) {
    console.error('Google One Tap not initialized')
    return
  }
  if (!el) {
    console.error(`Google button el not found`)
    return
  }
  tap.renderButton(el, {
    type: 'standard',
    shape: 'pill',
    text: 'continue_with',
    theme: store.getState().app.darkMode ? 'filled_black' : 'outline',
    size: 'large',
  })
}

export const prompt = () => {
  const tap = (window as WindowWithGoogle).google?.accounts?.id
  // eslint-disable-next-line no-console
  console.log('tap', tap)
  if (!tap) {
    console.error('Google One Tap not initialized')
    return
  }
  tap.initialize(initOptions)
  tap.prompt()
}
export function GoogleOneTapButton({
  id = 'one-tap-button',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { id?: string }) {
  const ref = React.createRef<HTMLDivElement>()
  const loaded = React.useRef(false)
  const tap = (window as WindowWithGoogle).google?.accounts?.id
  const token = useAppSelector(state => state.app.token)
  const enabled = useAppSelector(state => state.app.settings?.system?.enableOneTapLogin)
  const clientId = useAppSelector(state => state.app.settings?.google?.clientId)
  React.useEffect(() => {
    if (!loaded.current && clientId && enabled) {
      loaded.current = true
      tap?.initialize({
        ...initOptions,
        client_id: clientId,
      })
      const button = document.getElementById(id)
      if (button) renderButton(button)
    }
  }, [tap, id, ref, token, enabled, clientId])
  return <div id={id} ref={ref} {...props} />
}
export function GoogleOneTap(): JSX.Element {
  const token = useAppSelector(state => state.app.token)
  const enabled = useAppSelector(state => state.app.settings?.system?.enableOneTapLogin)
  const clientId = useAppSelector(state => state.app.settings?.google?.clientId)
  const dispatch = useAppDispatch()
  const loaded = React.useRef(false)
  React.useEffect(() => {
    if (!enabled || !clientId) {
      return
    }

    if (!loaded.current && !token) {
      loadScriptAndInit({
        ...initOptions,
        clientId,
      })
      loaded.current = true
    }
  }, [dispatch, token, enabled, clientId])

  return <></>
}

export default GoogleOneTap
