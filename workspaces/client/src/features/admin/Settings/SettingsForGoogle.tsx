import { SettingState, SettingType } from '@lib'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { notifyError } from 'src/features/app'
import { selectJsonFile } from 'src/shared/selectFile'
import { useAppDispatch } from 'src/shared/store'

export default function SettingsForGoogle({
  data,
  save
}: {
  data?: SettingState
  save: (name: SettingType, prop: string, value: unknown) => void
}) {
  const dispatch = useAppDispatch()
  const handleClipboard = async () => {
    const clip = await navigator.clipboard.readText()
    const tokenize = [...clip.matchAll(/(\w+): \"(.*)\"/g)]
    const result = tokenize.reduce((acc, cur) => {
      const propName = cur?.[1] as string
      const propValue = cur?.[2]
      if (propName && propValue) {
        acc[propName] = propValue
      }
      return acc
    }, {} as Record<string, string>)

    if (result.apiKey && result.apiKey != data?.google?.apiKey) {
      save('google', 'apiKey', result.apiKey)
    }
    if (result.appId && result.appId != data?.google?.appId) {
      save('google', 'appId', result.appId)
    }
    if (result.projectId && result.projectId != data?.google?.projectId) {
      save('google', 'projectId', result.projectId)
    }
    if (result.measurementId && result.measurementId != data?.google?.measurementId) {
      save('google', 'measurementId', result.measurementId)
    }
    if (result.messagingSenderId && result.messagingSenderId != data?.google?.messagingSenderId) {
      save('google', 'messagingSenderId', result.messagingSenderId)
    }
  }
  const handlePrivateKey = async () => {
    const result = await selectJsonFile()
    if (!result) {
      return
    }

    if (!result.private_key) {
      dispatch(notifyError('Invalid Admin SDK JSON file. No private_key found.'))
      return
    }

    save('internal', 'secrets.google.serviceAccountJson', JSON.stringify(result))
  }

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
              <Typography variant="h6" component="h4">
                Project and Credentials
              </Typography>
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
                value={data?.google?.measurementId || ''}
                onChange={e => save('google', 'measurementId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="OAuth 2.0 Client ID"
                fullWidth
                value={data?.google?.clientId || ''}
                onChange={e => save('google', 'clientId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="OAuth 2.0 Client Secret"
                fullWidth
                value={data?.internal?.secrets?.google?.clientSecret || ''}
                onChange={e => save('internal', 'secrets.google.clientSecret', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Service Account Generated Private Key.json"
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
              <Button fullWidth onClick={handleClipboard}>
                Load from Clipboard
              </Button>
              <Button fullWidth onClick={handlePrivateKey}>
                Load from generared key adminsdk.json
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
