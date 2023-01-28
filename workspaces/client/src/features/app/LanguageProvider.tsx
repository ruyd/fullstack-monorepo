import React from 'react'
import { IntlProvider } from 'react-intl'
import { useAppSelector } from '../../shared/store'

export type IntlProviderProps = React.ComponentProps<typeof IntlProvider>

export interface MessagesFile {
  [key: string]: string
}

async function loadLocale(locale: string): Promise<Record<string, string>> {
  return import(`../languages/${locale}.json`) as unknown as Record<string, string>
}

export default function LanguageProvider(props: { children: React.ReactElement }) {
  const { children } = props
  const locale = useAppSelector(state => state.app.locale)
  const [messages, setMessages] = React.useState<Record<string, string>>({})
  React.useEffect(() => {
    loadLocale(locale).then(res => setMessages(res))
  }, [locale])

  return (
    <IntlProvider locale={locale} messages={messages} defaultLocale="en">
      {children}
    </IntlProvider>
  )
}
