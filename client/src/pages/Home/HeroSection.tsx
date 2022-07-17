import { Box, Button, Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { Paths } from 'src/shared/routes'

export default function HeroSection({
  title = 'Fullstack TypeScript sample app',
  subtitle = 'Software patterns showcase featuring drawings and monorepo template',
  caption = 'See for yourself',
  children,
}: {
  title?: string
  subtitle?: string
  caption?: string
  children?: React.ReactNode
}) {
  return (
    <Container sx={{ m: '3rem 0 2.5rem 0' }}>
      <Box textAlign="center">
        <Typography variant="h4">{title}</Typography>
        <Typography variant="h6" sx={{ m: '.5rem 0 1.5rem 0' }}>
          {subtitle}
        </Typography>
        <Button component={Link} to={Paths.Draw}>
          {caption}
        </Button>
        {children}
      </Box>
    </Container>
  )
}
