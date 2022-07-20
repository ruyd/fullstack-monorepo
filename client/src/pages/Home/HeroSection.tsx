import React from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { Paths } from 'src/shared/routes'

export default function HeroSection({
  title = 'Fullstack TypeScript sample app',
  subtitle = 'Software patterns showcase and monorepo template',
  caption = 'Take it for a spin',
  children,
}: {
  title?: string
  subtitle?: string
  caption?: string
  children?: React.ReactNode
}) {
  return (
    <Container sx={{ m: '3rem 0 4rem 0' }}>
      <Box textAlign="center">
        <Typography variant="h4">{title}</Typography>
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
