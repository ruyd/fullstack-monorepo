import React from 'react'
import { Container } from '@mui/material'
import Gallery from './Gallery'
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

/**
 * home page
 * ImageList wall
 * react-responsive-carousel
 *
 */
