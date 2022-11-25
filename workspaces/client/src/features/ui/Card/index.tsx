import React from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material'

// constant
const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 },
}

export interface CardProps {
  border?: boolean
  boxShadow?: boolean
  children?: React.ReactNode
  content?: boolean
  contentClass?: string
  contentSX?: object
  darkTitle?: boolean
  secondary?: React.ReactNode
  shadow?: string
  sx?: object
  title?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

// ==============================|| CUSTOM MAIN CARD ||============================== //

export function MainCard(
  {
    border = true,
    boxShadow,
    children,
    content = true,
    contentClass = '',
    contentSX = {},
    darkTitle,
    secondary,
    shadow,
    sx = {},
    title,
    ...others
  }: CardProps,
  ref?: React.MutableRefObject<HTMLDivElement>,
) {
  const theme = useTheme()
  return (
    <Card
      ref={ref}
      {...others}
      sx={{
        border: border ? '1px solid' : 'none',
        borderColor: theme.palette.primary.main[200] + 75,
        ':hover': {
          boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit',
        },
        ...sx,
      }}
    >
      <>
        {/* card header and action */}
        {!darkTitle && title && <CardHeader sx={headerSX} title={title} action={secondary} />}
        {darkTitle && title && (
          <CardHeader
            sx={headerSX}
            title={<Typography variant="h3">{title}</Typography>}
            action={secondary}
          />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </>
    </Card>
  )
}

export default MainCard
