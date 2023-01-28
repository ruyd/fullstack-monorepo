import React from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { Paths } from 'src/shared/routes'
import { FormattedMessage } from 'react-intl'

export default function HeroSection({
  subtitle = 'Foundation template for your projects and startups',
  caption = 'Take it for a spin',
  children,
}: {
  subtitle?: string
  caption?: string
  children?: React.ReactNode
}) {
  return (
    <Container sx={{ m: '3rem 0 4rem 0' }}>
      <Box textAlign="center">
        <Typography variant="h4">
          <FormattedMessage
            id="home.title"
            description="Hero Title"
            defaultMessage="Drawings Marketplace"
          />
        </Typography>
        <Typography variant="h5" sx={{ m: '.5rem 0 1.5rem 0' }}>
          {subtitle}
        </Typography>
        <Button component={Link} to={Paths.Draw} variant="outlined">
          {caption}
        </Button>
        {children}
      </Box>
    </Container>
  )
}
