import React from 'react'
import { Container, Stack } from '@mui/material'
import { Testy } from '@root/lib'
export default function HomePage() {
  const x = Testy
  return (
    <Container component="main" maxWidth="xl">
      <Stack spacing={3} alignItems="center">
        <h1>Home</h1>
        <div>
          abcd
          {`${x}`}s
        </div>
      </Stack>
    </Container>
  )
}
