/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import StartImage from './images/start.svg'

export default function StartPage() {
  // send request create internal setting with admin email
  // create token with admin roles
  // if success redirect to admin page
  return (
    <Paper
      sx={{
        flex: 1,
        borderRadius: 0,
        display: 'flex',
        backgroundImage: `url(${StartImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '70%',
        backgroundPosition: 'left bottom',
      }}
    >
      <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ p: '2rem 3rem 2rem 3rem', borderRadius: '16px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
              Empty Database
            </Typography>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
              Please enter the first admin&apos;s email:
            </Typography>
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="filled"
              inputProps={{ sx: { fontSize: '1.5rem' } }}
            />
          </CardContent>
          <CardActions>
            <Button variant="contained" fullWidth size="large">
              Start
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Paper>
  )
}
