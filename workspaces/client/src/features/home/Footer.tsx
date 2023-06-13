import { Box, Container, Grid, Link, Typography } from '@mui/material'

const Footer = () => {
  return (
    <footer className="footer">
      <Box sx={{ borderTop: 'solid 15em #fbcc65' }}></Box>
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="h3">
              About Us
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquam lectus vitae
              diam dictum, ac tincidunt eros rutrum. Sed lacinia nisl non purus scelerisque, a
              interdum ex lacinia.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" component="h3">
              Links
            </Typography>
            <ul className="footer-links">
              <li>
                <Link color="secondary" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link color="secondary" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link color="secondary" href="/services">
                  Services
                </Link>
              </li>
              <li>
                <Link color="secondary" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" component="h3">
              Contact
            </Typography>
            <Typography variant="body2" color="textSecondary">
              123 Street, City Name
              <br />
              Country
              <br />
              contact@example.com
              <br />
              +123456789
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <div className="footer-bottom">
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" align="center">
            &copy; {new Date().getFullYear()} Your Startup Name. All rights reserved.
          </Typography>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
