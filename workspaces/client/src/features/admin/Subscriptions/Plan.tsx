/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Grid,
  TextField,
  Button,
  Box,
  Radio,
  ToggleButton,
  Switch,
  FormControlLabel,
  FormGroup,
  Paper,
} from '@mui/material'
import { SubscriptionPlan, User } from '@lib'

export default function PlanEdit({ item }: { item?: SubscriptionPlan }): JSX.Element {
  const submitHandler = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <Box component="form" sx={{}} onSubmit={submitHandler} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                required
                fullWidth
                id="name"
                name="name"
                label="Name"
                autoComplete="off"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="description"
                name="description"
                label="Description"
                autoComplete="off"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="amount"
                name="amount"
                label="Price"
                autoComplete="off"
                variant="filled"
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Paper sx={{ padding: 2, background: 'unset' }} variant="outlined">
              <FormGroup sx={{ alignItems: 'center' }}>
                <FormControlLabel
                  control={<Switch value={item?.enabled as boolean} />}
                  label="Enabled"
                />
              </FormGroup>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ padding: 2, background: 'unset', textAlign: 'center' }} variant="outlined">
              <Button variant="contained" fullWidth>
                Modify
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
