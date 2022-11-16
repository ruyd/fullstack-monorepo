import React from 'react'
import config from './config'

export interface GoogleOneTapOptions {
  clientId?: string
  autoSelect?: boolean
  cancelOnTapOutside?: boolean
  context?: 'use' | 'signin'
  callback?: (response: unknown) => void
}

export default function googleOneTap({
  clientId,
  autoSelect = false,
  cancelOnTapOutside = false,
  context = 'signin',
  callback,
  ...otherOptions
}: GoogleOneTapOptions): void {
  if (typeof window !== 'undefined' && window.document) {
    const contextValue = ['signin', 'signup', 'use'].includes(context) ? context : 'signin'
    const googleScript = document.createElement('script')
    googleScript.src = 'https://accounts.google.com/gsi/client'
    googleScript.async = true
    googleScript.defer = true
    document.head.appendChild(googleScript)
    window.onload = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const google = (window as any).google
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
      }
    }
  }
}

export function GoogleOneTap({ children }: React.PropsWithChildren): JSX.Element {
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!isLoaded) {
      googleOneTap({ clientId: config.auth?.google?.clientId })
      setIsLoaded(true)
    }
  }, [isLoaded])

  return children as JSX.Element
}
