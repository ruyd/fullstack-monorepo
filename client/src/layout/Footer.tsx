import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

export default function Footer() {
  return (
    <Container>
      <Box component="footer">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              © {new Date().getFullYear()} Test
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} textAlign="right">
            <Typography variant="body1">Made with love</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
