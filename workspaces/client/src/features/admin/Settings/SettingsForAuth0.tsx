import { SettingState, SettingType } from '@lib'
import { Button, Grid, Link, TextField, Typography } from '@mui/material'

export default function SettingsForAuth0({
  data,
  save
}: {
  data?: SettingState
  save: (name: SettingType, prop: string, value: unknown) => void
}) {
  return (
    <>
      <Grid item xs={4}>
        <Typography variant="h6" component="h3">
          Auth0
        </Typography>
      </Grid>
      <Grid item xs={8} sx={{ textAlign: 'right' }}>
        <Button fullWidth>Configure Automatically</Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" component="p" mb={1}>
          Input your `Tenant`, `Client ID` and `Client Secret` from the API Explorer App to
          configure automatically or manually enter settings below:{' '}
          <Link href="https://manage.auth0.com/dashboard" target="_blank">
            Open Auth0 dashboard
          </Link>{' '}
          and go to API Explorer Application - Settings - copy Client ID and Secret
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Tenant"
          fullWidth
          value={data?.auth0?.tenant || ''}
          required
          onChange={e => save('auth0', 'tenant', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Explorer Client ID"
          fullWidth
          value={data?.auth0?.explorerId || ''}
          onChange={e => save('auth0', 'explorerId', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Explorer Client Secret"
          fullWidth
          value={data?.internal?.secrets?.auth0?.managerSecret || ''}
          onChange={e => save('internal', 'secrets.auth0.managerSecret', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Client ID"
          fullWidth
          value={data?.auth0?.clientId || ''}
          onChange={e => save('auth0', 'clientId', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Client Secret"
          fullWidth
          value={data?.internal?.secrets?.auth0?.clientSecret || ''}
          onChange={e => save('internal', 'secrets.auth0.clientSecret', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Audience"
          fullWidth
          value={data?.auth0?.clientAudience || ''}
          onChange={e => save('auth0', 'clientAudience', e.target.value)}
        />
      </Grid>
    </>
  )
}
