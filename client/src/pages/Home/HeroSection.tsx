import { Box, Button, Container, styled, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import HeroImage from '../../images/undraw_complete_design_re_h75h.svg'
const StyledImage = styled(`img`)(() => ({
  maxHeight: '20rem',
  display: 'block',
  margin: '2rem auto',
}))

export default function HeroSection({
  title = 'TypeScript canvas sample app',
  subtitle = 'FullStack patterns showcase and leveled up monorepo template',
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
        <Button component={Link} to="/drawings">
          {caption}
        </Button>
        {children}
      </Box>
    </Container>
  )
}
