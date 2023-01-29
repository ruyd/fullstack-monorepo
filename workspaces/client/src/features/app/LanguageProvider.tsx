import React from 'react'
import { IntlProvider } from 'react-intl'
import { useAppSelector } from '../../shared/store'

export type IntlProviderProps = React.ComponentProps<typeof IntlProvider>

const cache: Record<string, Record<string, string>> = {}

async function loadLocale(locale: string): Promise<Record<string, string>> {
  if (cache[locale]) return cache[locale]
  cache[locale] = await import(`../languages/${locale}.json`)
  return cache[locale]
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
