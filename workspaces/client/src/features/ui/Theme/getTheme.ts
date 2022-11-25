/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTheme, Palette, Theme, ThemeOptions } from '@mui/material/styles'
import { Typography } from '@mui/material/styles/createTypography'
import { CSSProperties } from '@mui/styled-engine'
import colors from './scss/_themes-vars.module.scss'
import componentStyleOverrides from './componentStyleOverrides'
// import themePalette from './palette'
// import themeTypography from './typography'

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

const colorOptions = {
  colors,
  heading: colors.grey900,
  paper: colors.paper,
  backgroundDefault: colors.paper,
  background: colors.primaryLight,
  darkTextPrimary: colors.grey700,
  darkTextSecondary: colors.grey500,
  textDark: colors.grey900,
  menuSelected: colors.secondaryDark,
  menuSelectedBack: colors.secondaryLight,
  divider: colors.grey200,
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
  const components = componentStyleOverrides(themeOptions)
  return { ...themes, components }
}

export default getTheme
