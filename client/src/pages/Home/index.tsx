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

/**
 * hero margins add
 * galley cards like https://www.youtube.com/watch?v=evqUWEh46AA
 * - image slider component check
 * logos
 *
 */
