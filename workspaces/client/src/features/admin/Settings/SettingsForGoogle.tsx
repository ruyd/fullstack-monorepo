import { SettingState, SettingType } from '@lib'
import {
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Link,
  Switch,
  TextField,
  Typography
} from '@mui/material'

export default function SettingsForGoogle({
  data,
  save
}: {
  data?: SettingState
  save: (name: SettingType, prop: string, value: unknown) => void
}) {
  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h5" component="h2">
                Google
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="h6" component="h3">
                Signin with Google
              </Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!data?.google?.enabled}
                    onChange={() => save('google', 'enabled', !data?.google?.enabled)}
                  />
                }
                label="Enable"
              />
            </Grid>
            <Grid item xs={9}>
              <Typography variant="h6" component="h5">
                OneTap Onboarding
              </Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!data?.system?.enableOneTapLogin}
                    onChange={() =>
                      save('system', 'enableOneTapLogin', !data?.system?.enableOneTapLogin)
                    }
                  />
                }
                label="Enable"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" component="p">
                <Link href="https://console.cloud.google.com/apis/credentials" target="_blank">
                  Project OAuth 2.0 Client ID and Secret (Click Create Credentials then OAuth client
                  ID)
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Client ID"
                fullWidth
                value={data?.google?.clientId || ''}
                onChange={e => save('google', 'clientId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Client Secret"
                fullWidth
                value={data?.internal?.secrets?.google?.clientSecret || ''}
                onChange={e => save('internal', 'secrets.google.clientSecret', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h4">
                GCP and Firebase
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="serviceAccountKey.json File Contents"
                fullWidth
                value={data?.internal?.secrets?.google?.serviceAccountJson || ''}
                multiline
                rows={4}
                onChange={e =>
                  save('internal', 'secrets.google.serviceAccountJson', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Project ID"
                fullWidth
                value={data?.google?.projectId || ''}
                onChange={e => save('google', 'projectId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Web API Key"
                fullWidth
                value={data?.google?.apiKey || ''}
                onChange={e => save('google', 'apiKey', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="App ID"
                fullWidth
                value={data?.google?.appId || ''}
                onChange={e => save('google', 'appId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Messaging Sender ID"
                fullWidth
                value={data?.google?.messagingSenderId || ''}
                onChange={e => save('google', 'messagingSenderId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Analytics ID"
                fullWidth
                value={data?.google?.analyticsId || ''}
                onChange={e => save('google', 'analyticsId', e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
