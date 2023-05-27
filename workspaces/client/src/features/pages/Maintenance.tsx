import Paper from '@mui/material/Paper'
import image from './images/maintenance.svg'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
export default function Maintenance() {
  return (
    <Paper sx={{ flex: 1, display: 'flex', borderRadius: 0 }}>
      <Grid
        container
        sx={{
          backgroundImage: `url(${image})`,
          backgroundPosition: 'bottom left',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '50%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 30
        }}
      >
        <Grid item>
          <Typography variant="h2" component="h1" align="center">
            Offline for Maintenance
          </Typography>
          <Typography variant="h5" component="h2" align="center">
            Please come back later
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}
