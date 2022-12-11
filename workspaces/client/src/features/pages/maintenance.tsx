import { Container, Typography } from '@mui/material'
import image from './images/maintenance.svg'
export default function Maintenance() {
  return (
    <Container>
      <Typography variant="h2" component="h1" align="center">
        Maintenance
      </Typography>
      <img src={image} />
    </Container>
  )
}
