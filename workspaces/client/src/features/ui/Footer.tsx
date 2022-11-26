import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { TypographyProps } from '@mui/system'
import github from '../home/images/github.svg'
import { Link } from '@mui/material'

const Text = ({ children, ...rest }: TypographyProps & { children: React.ReactNode }) => (
  <Typography component="span" color="gray" fontSize={12} {...rest}>
    {children}
  </Typography>
)

export default function Footer() {
  return (
    <footer>
      <Container>
        <Box margin={1}>
          <Grid container>
            <Grid item textAlign="center" xs={12}>
              <Link href="https://github.com/ruyd/fullstack-monorepo">
                <img
                  src={github}
                  style={{ margin: '0 .5rem -.2rem 0', width: 20, height: 20 }}
                  width={20}
                  height={20}
                  alt="GitHub"
                />
                <Text>Project Template by Ruy</Text>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </footer>
  )
}
