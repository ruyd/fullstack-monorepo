import React from 'react'
import { Container, Stack } from '@mui/material'
import { HotReloadTestVar } from '@root/lib'
export default function HomePage() {
  return (
    <Container component="main" maxWidth="xl">
      <Stack spacing={3} alignItems="center">
        <h1>Home</h1>
        <div>{`${HotReloadTestVar}`}s</div>
      </Stack>
    </Container>
  )
}
