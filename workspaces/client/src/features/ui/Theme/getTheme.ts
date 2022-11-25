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
  // const options: ThemeOptions = {
  //   ...colorOptions,

  //   state,
  // }

  const themeOptions: ThemeOptions = {
    direction: 'ltr',
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    mixins: {
      toolbar: {
        //   minHeight: '48px',
        //   padding: '16px',
        //   '@media (min-width: 600px)': {
        //     minHeight: '48px',
        //   },
      },
    },
  }

  const themes = createTheme(themeOptions)
  //const components = componentStyleOverrides(themeOptions)
  return { ...themes }
}

export default getTheme
