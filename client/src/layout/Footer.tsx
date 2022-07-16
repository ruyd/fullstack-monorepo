import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LoadingLine from './LoadingLine'
import { TypographyProps } from '@mui/system'

const Text = ({
  children,
  ...rest
}: TypographyProps & { children: React.ReactNode }) => (
  <Typography component="span" color="gray" fontSize={12} {...rest}>
    {children}
  </Typography>
)

export default function Footer() {
  return (
    <footer>
      <Container>
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <img
                src="https://img.shields.io/badge/License-ISC-blue.svg"
                style={{ margin: '0 .5rem -.2rem 0', width: 80, height: 20 }}
                width={80}
                height={20}
              />
              <Text>on {new Date().getFullYear()}</Text>
            </Grid>
            <Grid item textAlign="right" xs={6}>
              <Text>Made with love by Ruy</Text>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <LoadingLine />
    </footer>
  )
}
