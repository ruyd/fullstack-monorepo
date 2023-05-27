import Container from '@mui/material/Container'
import Gallery from '../ui/Gallery'
import HeroSection from './HeroSection'
import Logos from './Logos'
export default function HomePage() {
  return (
    <Container>
      <HeroSection />
      <Gallery />
      <Logos />
    </Container>
  )
}
