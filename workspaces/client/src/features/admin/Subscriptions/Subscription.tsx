/* eslint-disable @typescript-eslint/no-unused-vars */

import { Subscription } from '@lib'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'

export default function SubscriptionEdit({ item }: { item?: Subscription }): JSX.Element {
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
              <FormGroup sx={{ alignItems: 'center' }}></FormGroup>
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
