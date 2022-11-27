import {
  createTheme,
  Palette,
  PaletteColorOptions,
  Theme,
  ThemeOptions,
} from '@mui/material/styles'
import { Typography } from '@mui/material/styles/createTypography'
import { CSSProperties } from '@mui/styled-engine'
import colors from './colors.module.scss'

declare module '@mui/material/styles' {
  interface PaletteOptions {
    orange?: PaletteColorOptions
    dark?: PaletteColorOptions
  }
  interface Theme {
    state?: ThemeState
    palette: Palette & { orange: Palette['primary'] }
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
export interface ThemeState {
  gridSpacing?: number
}
export function getTheme(darkMode?: boolean, state?: ThemeState): Theme {
  const themeOptions: ThemeOptions = {
    direction: 'ltr',
    palette: {
      mode: darkMode ? 'dark' : 'light',
      common: {
        black: colors?.darkPaper,
      },
      primary: {
        light: colors?.primaryLight,
        main: colors?.primaryMain,
        dark: colors?.primaryDark,
        200: colors?.primary200,
        800: colors?.primary800,
      },
      secondary: {
        light: colors?.secondaryLight,
        main: colors?.secondaryMain,
        dark: colors?.secondaryDark,
        200: colors?.secondary200,
        800: colors?.secondary800,
      },
      error: {
        light: colors?.errorLight,
        main: colors?.errorMain,
        dark: colors?.errorDark,
      },
      orange: {
        light: colors?.orangeLight,
        main: colors?.orangeMain,
        dark: colors?.orangeDark,
      },
      warning: {
        light: colors?.warningLight,
        main: colors?.warningMain,
        dark: colors?.warningDark,
      },
      success: {
        light: colors?.successLight,
        200: colors?.success200,
        main: colors?.successMain,
        dark: colors?.successDark,
      },
      grey: {
        50: colors?.grey50,
        100: colors?.grey100,
        500: colors?.darkTextSecondary,
        600: colors?.heading,
        700: colors?.darkTextPrimary,
        900: colors?.textDark,
      },
      dark: {
        light: colors?.darkTextPrimary,
        main: colors?.darkLevel1,
        dark: colors?.darkLevel2,
        800: colors?.darkBackground,
        900: colors?.darkPaper,
      },
    },
    mixins: {
      toolbar: {},
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
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
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: 'background.paper',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 'auto',
            maxHeight: 'auto',
            '& .MuiTab-flexContainer': {
              padding: 0,
            },
          },
        },
      },
    },
    state,
  }

  // jest doesn't like css vars
  if (process.env.NODE_ENV === 'test') {
    return createTheme()
  }

  const theme = createTheme(themeOptions)
  return { ...theme }
}

export default getTheme
