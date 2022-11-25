import { createTheme, Theme, ThemeOptions } from '@mui/material/styles'
import colors from 'assets/scss/_themes-vars.module.scss'
import componentStyleOverrides from './componentStyleOverrides'
import themePalette from './palette'
import themeTypography from './typography'

export interface ThemeState {
  gridSpacing?: number
}

declare module '@mui/material/styles' {
  interface Theme {
    state?: ThemeState
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
  const options: ThemeOptions = {
    ...colorOptions,
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    state,
  }

  const themeOptions: ThemeOptions = {
    direction: 'ltr',
    palette: themePalette(options),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px',
        },
      },
    },
    typography: themeTypography(options),
  }

  const themes = createTheme(themeOptions)
  const components = componentStyleOverrides(themeOptions)
  return { ...themes, components }
}

export default getTheme
