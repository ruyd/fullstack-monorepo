/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTheme, Palette, Theme, ThemeOptions } from '@mui/material/styles'
import { Typography } from '@mui/material/styles/createTypography'
import { CSSProperties } from '@mui/styled-engine'

export interface ThemeState {
  gridSpacing?: number
}

declare module '@mui/material/styles' {
  interface Theme {
    state?: ThemeState
    palette: Palette & { orange?: Palette['primary'] }
    typography: Typography & {
      commonAvatar?: CSSProperties
      largeAvatar?: CSSProperties
      mediumAvatar?: CSSProperties
      smallAvatar?: CSSProperties
    }
  }
  interface ThemeOptions {
    state?: ThemeState
  }
}

export function getTheme(darkMode?: boolean, state?: ThemeState): Theme {
  const themeOptions: ThemeOptions = {
    direction: 'ltr',
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    mixins: {
      toolbar: {},
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*::-webkit-scrollbar': {
            width: '12px',
          },
          '*::-webkit-scrollbar-track': {
            background: darkMode ? '#646464' : '#e0e0e0',
          },
          '*::-webkit-scrollbar-thumb': {
            background: darkMode ? '#242424' : '#b0b0b0',
            borderRadius: '2px',
          },
        },
      },
    },
  }

  const theme = createTheme(themeOptions)
  return { ...theme }
}

export default getTheme
