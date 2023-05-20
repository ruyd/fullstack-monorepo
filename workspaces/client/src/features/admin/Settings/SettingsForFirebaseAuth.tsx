import { SettingState, SettingType } from '@lib'
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'

export default function SettingsForFirebase({
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
            <Grid item xs={6}>
              <Typography variant="h6" component="h3">
                Firebase
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button fullWidth>Check Settings</Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="API Key"
                fullWidth
                value={data?.internal?.secrets?.google.apiKey || ''}
                onChange={e => save('internal', 'secrets.google.apiKey', e.target.value)}
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
                label="Project ID"
                fullWidth
                value={data?.google?.projectId || ''}
                onChange={e => save('google', 'projectId', e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
