import React from 'react'

import { Link } from 'react-router-dom'
import { Paths } from '../../shared/routes'
import { FormattedMessage, defineMessages } from 'react-intl'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Grid } from '@mui/material'
import styled from '@mui/system/styled'

const messages = defineMessages({
  buttonCaption: {
    id: 'home.button',
    description: 'Hero Button Caption',
    defaultMessage: 'Take it for a spin'
  }
})

const StyledTypography = styled(Typography)({
  transform:
    'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
  opacity: 1,
  transformStyle: 'preserve-3d',
  margin: '.5rem 0 1.5rem 0',
  fontWeight: 700,
  letterSpacing: 0
})

export default function HeroSection({
  subtitle = 'Easy to use monorepo template for web projects',
  caption = <FormattedMessage {...messages.buttonCaption} />,
  children
}: {
  subtitle?: string
  caption?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <Grid sx={{ m: '3rem 0 4rem 0' }}>
      <Box textAlign="center">
        <StyledTypography variant="h3" className="slide-up">
          {subtitle}
        </StyledTypography>
        <Button
          component={Link}
          to={Paths.Draw}
          variant="outlined"
          sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05) translateY(4px)'
            }
          }}
        >
          {caption}
        </Button>
        {children}
      </Box>
    </Grid>
  )
}
