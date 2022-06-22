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

export function getTheme(mode: string): Theme {
  const options = mode === 'dark' ? darkOptions : lightOptions
  return createTheme(options)
}

export default function ThemeSwitch({
  children,
}: React.PropsWithChildren<{}>): JSX.Element {
  const selectedTheme = useAppSelector((store) => store.app.theme) || 'light'
  const theme = React.useMemo(() => getTheme(selectedTheme), [selectedTheme])
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
