import { SettingState, SettingType } from '@lib'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { Check } from '@mui/icons-material'
import { notify, notifyError, request } from 'src/features/app'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton'

export default function SettingsForFirebase({
  data
}: {
  data?: SettingState
  save: (name: SettingType, prop: string, value: unknown) => void
}) {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.app.loading)
  const google = data?.google
  const isProjectValid =
    google?.projectId &&
    google?.apiKey &&
    google?.appId &&
    google?.measurementId &&
    google?.messagingSenderId
  const isServiceReady = data?.internal?.secrets?.google?.serviceAccountJson
  const isAuthValid = google?.clientId && data?.internal?.secrets?.google?.clientSecret
  const handleCheck = async () => {
    const response = await request<{ ok: boolean; message: string }>('firebase/check')
    if (response?.data?.ok) {
      dispatch(notify(response.data.message))
    } else {
      dispatch(notifyError(response?.data?.message || 'Could not check with backend'))
    }
  }

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="h6" component="h3">
                Firebase Setup
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <LoadingButton loading={loading} fullWidth onClick={handleCheck}>
                Check Settings
              </LoadingButton>
            </Grid>
            <Grid item xs={12}>
              {/* do a MUI List checklist of tasks */}
              <List dense>
                <ListItem
                  secondaryAction={<Check color={isProjectValid ? 'success' : undefined} />}
                >
                  <ListItemAvatar>1</ListItemAvatar>
                  <ListItemText
                    primary="Enter Project ID and General Settings"
                    secondary={
                      <Link href="https://console.firebase.google.com" target="_blank">
                        Go to Firebase Console - Project Settings - General: Project ID, Web API
                        Key, App ID, Messaging Sender ID and Measurement ID
                      </Link>
                    }
                  />
                </ListItem>
                <ListItem
                  secondaryAction={<Check color={isServiceReady ? 'success' : undefined} />}
                >
                  <ListItemAvatar>2</ListItemAvatar>
                  <ListItemText
                    primary="Service Account Generated Private Key.json"
                    secondary={
                      <Link
                        href="https://console.firebase.google.com/u/0/project/default/settings/serviceaccounts/adminsdk"
                        target="_blank"
                      >
                        Go to Firebase Console - Project Settings - Service Accounts
                      </Link>
                    }
                  />
                </ListItem>
                <ListItem secondaryAction={<Check color={isAuthValid ? 'success' : undefined} />}>
                  <ListItemAvatar>3</ListItemAvatar>
                  <ListItemText
                    primary="OAuth 2.0 Client ID and Secret"
                    secondary={
                      <Link
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                      >
                        Go to Google APIs Credentials (Click Create Credentials then OAuth Client
                        ID)
                      </Link>
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
