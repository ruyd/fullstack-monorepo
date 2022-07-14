import React from 'react'
import { Container, Stack } from '@mui/material'
import Gallery from '../../features/gallery'
import HeroSection from './HeroSection'
export default function HomePage() {
  return (
    <Container component="main" maxWidth="xl">
      <HeroSection />
      <Gallery />
    </Container>
  )
}
