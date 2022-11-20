/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import React from 'react'
import store, { useAppDispatch, useAppSelector } from 'src/shared/store'
import { IdentityToken } from '../../../../lib/src/types'
import config from '../../shared/config'
import decode from 'jwt-decode'
import authProvider from 'auth0-js'
import { authOptions, checkSocialToken, generateNonce } from 'src/shared/auth'
import { v4 as uuid } from 'uuid'
import { notifyError, socialLoginAsync } from '../app'

type OneTapBase = {
  context?: 'use' | 'signin' | 'signup'
  callback?: (response: { credential?: string }) => void
}

const initOptions: OneTapParams = {
  client_id: config.auth?.google?.clientId,
  callback: async ok => {
    popupSocialLogin(ok.credential as string)
    /* response.credential should be enough for google cloud backends,
    using Callback.tsx for auth0 */
  },
}

export async function popupMessageHandler(
  e: MessageEvent<{ type: string; access_token: string; id_token: string; hash: string }>,
) {
  console.log('popup', e.data.type, e.data)
  if (e.data.type === 'social') {
    const { access_token, id_token, hash } = e.data
    //await store.dispatch(socialLoginAsync({ access_token, id_token }))
  }
}

export async function popupSocialLogin(credential: string): Promise<void> {
  const email = (decode(credential) as IdentityToken)?.email
  const userId = await checkSocialToken(credential)
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
        google.accounts.id.prompt(notification => console.log('prompt', notification))
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

export const GoogleOneTapButton = () => {
  const tap = (window as WindowWithGoogle).google?.accounts?.id
  React.useEffect(() => {
    tap.initialize(initOptions)
    tap.renderButton(document.getElementById('one-tap-button')!, {
      text: 'continue_with',
      theme: 'outline',
      size: 'large',
    })
  }, [tap])

  return <div id="one-tap-button"></div>
}
export function GoogleOneTap(): JSX.Element {
  const dispatch = useAppDispatch()
  const loaded = React.useRef(false)
  const ref = React.useRef<OneTapAPI | null>(null)
  const token = useAppSelector(state => state.app.token)

  React.useEffect(() => {
    if (!loaded.current && !token) {
      loadScriptAndInit({
        ...initOptions,
        ref,
      })
      window.onmessage = popupMessageHandler
      loaded.current = true
    }
  }, [dispatch, loaded, token])

  return <></>
}

export default GoogleOneTap
