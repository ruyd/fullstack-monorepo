import Container from '@mui/material/Container'
import image from './images/404.svg'
import Typography from '@mui/material/Typography'

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
