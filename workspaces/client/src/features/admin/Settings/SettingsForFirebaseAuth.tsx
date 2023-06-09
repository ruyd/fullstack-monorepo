/* eslint-disable @typescript-eslint/no-unused-vars */
import { SettingState, SettingType } from '@lib'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText
} from '@mui/material'
import { Check } from '@mui/icons-material'

export default function SettingsForFirebase({
  data,
  save
}: {
  data?: SettingState
  save: (name: SettingType, prop: string, value: unknown) => void
}) {
  const google = data?.google
  const isProjectValid =
    google?.projectId &&
    google?.apiKey &&
    google?.appId &&
    google?.measurementId &&
    google?.messagingSenderId
  const isServiceReady = data?.internal?.secrets?.google?.serviceAccountJson
  const isAuthValid = google?.clientId && data?.internal?.secrets?.google?.clientSecret

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
              <Button fullWidth>Check Settings</Button>
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
                    primary="Service Account Key (JSON)"
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
