import { List, ListItemText } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'

/**
 * Top URLs, Recent Activity, Recent Errors, Active Users
 * @returns
 */
export default function Dashboard() {
  return (
    <Box sx={{ m: '1rem 2.3rem' }}>
      <Grid container rowSpacing={2} columnSpacing={1}>
        <Grid xs={12}>
          <Typography component="h1" variant="h5">
            Dashboard
          </Typography>
        </Grid>
        <Grid>
          <Grid>
            <List>
              <ListItemText primary="Active Users" />
            </List>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
