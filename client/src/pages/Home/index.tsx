import React from 'react'
import { Container } from '@mui/material'
import Gallery from './Gallery'
import HeroSection from './HeroSection'
export default function HomePage() {
  return (
    <Container component="main" maxWidth="xl">
      <HeroSection />
      <Gallery />
    </Container>
  )
}
