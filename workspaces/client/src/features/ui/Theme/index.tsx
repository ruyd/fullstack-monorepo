import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { useAppSelector } from '../../../shared/store'
import { getTheme } from './getTheme'

export default function ThemeSwitch({ children }: React.PropsWithChildren<unknown>): JSX.Element {
  const darkTheme = useAppSelector(store => store.app.darkMode)
  const state = useAppSelector(store => store.app.theme)
  const theme = React.useMemo(() => getTheme(darkTheme, state), [darkTheme, state])
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
