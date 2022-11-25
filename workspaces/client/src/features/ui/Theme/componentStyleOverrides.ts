import { ThemeOptions } from '@mui/material'

export default function componentStyleOverrides(options: {
  [key: string]: any
}): ThemeOptions['components'] {
  const bgColor = options.colors?.grey50
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: '4px',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: `${options?.state?.borderRadius}px`,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: options.colors?.textDark,
          padding: '24px',
        },
        title: {
          fontSize: '1.125rem',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: options.darkTextPrimary,
          paddingTop: '10px',
          paddingBottom: '10px',
          '&.Mui-selected': {
            color: options.menuSelected,
            backgroundColor: options.menuSelectedBack,
            '&:hover': {
              backgroundColor: options.menuSelectedBack,
            },
            '& .MuiListItemIcon-root': {
              color: options.menuSelected,
            },
          },
          '&:hover': {
            backgroundColor: options.menuSelectedBack,
            color: options.menuSelected,
            '& .MuiListItemIcon-root': {
              color: options.menuSelected,
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: options.darkTextPrimary,
          minWidth: '36px',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: options.textDark,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: options.textDark,
          '&::placeholder': {
            color: options.darkTextSecondary,
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: bgColor,
          borderRadius: `${options?.customization?.borderRadius}px`,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: options.colors?.grey400,
          },
          '&:hover $notchedOutline': {
            borderColor: options.colors?.primaryLight,
          },
          '&.MuiInputBase-multiline': {
            padding: 1,
          },
        },
        input: {
          fontWeight: 500,
          background: bgColor,
          padding: '15.5px 14px',
          borderRadius: `${options?.customization?.borderRadius}px`,
          '&.MuiInputBase-inputSizeSmall': {
            padding: '10px 14px',
            '&.MuiInputBase-inputAdornedStart': {
              paddingLeft: 0,
            },
          },
        },
        inputAdornedStart: {
          paddingLeft: 4,
        },
        notchedOutline: {
          borderRadius: `${options?.customization?.borderRadius}px`,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: options.colors?.grey300,
          },
        },
        mark: {
          backgroundColor: options.paper,
          width: '4px',
        },
        valueLabel: {
          color: options?.colors?.primaryLight,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: options.divider,
          opacity: 1,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: options.colors?.primaryDark,
          background: options.colors?.primary200,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-deletable .MuiChip-deleteIcon': {
            color: 'inherit',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: options.paper,
          background: options.colors?.grey700,
        },
      },
    },
  }
}
