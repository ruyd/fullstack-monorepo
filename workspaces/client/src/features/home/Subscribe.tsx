import { Button, Card, CardContent, Grid, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Subscribe() {
  return (
    <Box>
      <Card color="primary">
        <CardContent>
          <Grid
            container
            sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 3 }}
            spacing={3}
          >
            <Grid item xs={12}>
              <Typography
                component="h2"
                sx={{ fontWeight: '700', fontSize: '40px', lineHeight: '70px' }}
              >
                Lorem ipsum dolor sit amet
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                size="small"
                name="email"
                type="email"
                placeholder="you@email.com"
                fullWidth
              />
            </Grid>
            <Grid item>
              <Button variant="contained">Join our mailing list</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
