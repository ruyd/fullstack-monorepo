import { createTheme, Theme, ThemeOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    state?: ThemeState
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
    state,
  }

  const theme = createTheme(themeOptions)
  return { ...theme }
}

export default getTheme
