import { User } from '@lib'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'

export function UserEdit({ user }: { user?: User }): JSX.Element {
  const submitHandler = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // const data = new FormData(e.currentTarget)
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
                id="firstName"
                name="firstName"
                label="First name"
                autoComplete="off"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                name="lastName"
                label="Last name"
                autoComplete="off"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
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
                  control={<Switch value={user?.banned as boolean} />}
                  label="Banned"
                />
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  Reset Pass
                </Button>
              </FormGroup>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ padding: 2, background: 'unset', textAlign: 'center' }} variant="outlined">
              <List>
                {user?.roles?.map((role, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={role} />
                  </ListItem>
                )) || 'No Roles'}
              </List>
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

export default UserEdit
