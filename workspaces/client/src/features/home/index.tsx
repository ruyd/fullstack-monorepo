/* eslint-disable @typescript-eslint/no-unused-vars */
import Container from '@mui/material/Container'
import Gallery from '../ui/Gallery'
import HeroSection from './HeroSection'
import Logos from './Logos'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Divider, Paper } from '@mui/material'
import Footer from './Footer'
import Subscribe from './Subscribe'
export default function HomePage() {
  return (
    <div>
      <div style={{ backgroundColor: '#f59585', margin: 0, padding: 5 }}>
        <Box>
          <HeroSection />
        </Box>
      </div>
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 5, fontWeight: 600 }}>
        Drawings Marketplace
      </Typography>
      <Box sx={{ m: 5, mb: 8 }}>
        <Gallery />
      </Box>
      <Subscribe />
      <Logos />
      <Footer />
    </div>
  )
}
