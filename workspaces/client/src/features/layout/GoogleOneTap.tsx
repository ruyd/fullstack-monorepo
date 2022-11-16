/* eslint-disable no-console */
import React from 'react'
import { useAppDispatch } from 'src/shared/store'
import config from '../../shared/config'
import { socialLoginAsync } from '../app'

type TabBaseOptions = {
  context?: 'use' | 'signin' | 'signup'
  callback?: (response: { credentials?: string }) => void
}

export interface GoogleOneTapParams extends TabBaseOptions {
  client_id?: string
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
}
export type OneTapAPI = {
  accounts: { id: { initialize: (options: GoogleOneTapParams) => void; prompt: () => void } }
}
export type WindowWithGoogle = Window & typeof globalThis & { google: OneTapAPI }

export interface OneTapHookOptions extends TabBaseOptions {
  clientId?: string
  autoSelect?: boolean
  cancelOnTapOutside?: boolean
  ref?: React.MutableRefObject<OneTapAPI | null>
}

export default function googleOneTap({
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
  const g = (window as WindowWithGoogle).google
  console.log('g', g?.accounts?.id)
  g?.accounts?.id.initialize({ client_id: config.auth?.google?.clientId })
  g?.accounts?.id.prompt()
}
export function GoogleOneTap({ children }: React.PropsWithChildren): JSX.Element {
  const dispatch = useAppDispatch()
  const loaded = React.useRef(false)
  const ref = React.useRef<OneTapAPI | null>(null)

  React.useEffect(() => {
    if (!loaded.current) {
      googleOneTap({
        clientId: config.auth?.google?.clientId,
        callback: ok => dispatch(socialLoginAsync(ok)),
        ref,
      })
      loaded.current = true
    }
  }, [dispatch, loaded])

  return <>{children}</>
}
