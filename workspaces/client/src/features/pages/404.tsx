import { Container, Typography } from '@mui/material'
import image from './images/404.svg'
export default function Error404() {
  return (
    <Container>
      <Typography variant="h2" component="h1" align="center">
        Oops!
      </Typography>
      <img src={image} />
    </Container>
  )
}
