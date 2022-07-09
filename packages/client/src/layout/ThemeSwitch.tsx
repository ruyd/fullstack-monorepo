import {
  createTheme,
  Theme,
  ThemeOptions,
  ThemeProvider,
} from '@mui/material/styles'
import React from 'react'
import { useAppSelector } from '../shared/store'
const darkOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
  },
}

const lightOptions: ThemeOptions = {}

export function getTheme(darkMode: boolean): Theme {
  const options = darkMode ? darkOptions : lightOptions
  return createTheme(options)
}

export default function ThemeSwitch({
  children,
}: React.PropsWithChildren<{}>): JSX.Element {
  const darkTheme = useAppSelector((store) => store.app.darkTheme)
  const theme = React.useMemo(() => getTheme(darkTheme), [darkTheme])
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
