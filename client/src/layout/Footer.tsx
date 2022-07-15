import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LoadingLine from './LoadingLine'

const Text = ({ children, ...rest }: { children: React.ReactNode }) => (
  <Typography variant="body1" color="gray" fontSize={12} {...rest}>
    {children}
  </Typography>
)

export default function Footer() {
  return (
    <>
      <Container component="footer" sx={{ position: 'sticky', bottom: 0 }}>
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Text>
                <img
                  src="https://img.shields.io/badge/License-ISC-blue.svg"
                  style={{ margin: '0 1rem 0 0' }}
                />
                on {new Date().getFullYear()}
              </Text>
            </Grid>
            <Grid item xs={12} md={6} textAlign="right">
              <Text>Made with love by Ruy</Text>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <LoadingLine />
    </>
  )
}
