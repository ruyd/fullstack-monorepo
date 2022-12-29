/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabPanel from '../ui/TabPanel'
import Box from '@mui/material/Box'
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useAppDispatch } from '../../shared/store'
import { Setting, SystemSettings, GoogleSettings, Auth0Settings } from '@lib'
import { get, notify, notifyError, request } from '../app'
export default function Settings() {
  const dispatch = useAppDispatch()
  const [system, setSystem] = React.useState<SystemSettings>({
    disable: false,
    enableStore: false,
    auth: 'auth0',
  })
  const [google, setGoogle] = React.useState<GoogleSettings>({})
  const [auth, setAuth] = React.useState<Auth0Settings>({
    tenant: '',
    redirectUrl: '',
    enabled: false,
  })
  const [settings, setSettings] = React.useState<Setting[]>([])

  const load = async () => {
    const response = await get<Setting[]>('setting')
    if (Array.isArray(response.data)) {
      setSystem(response.data.find(s => s.name === 'system')?.data as SystemSettings)
      setGoogle(response.data.find(s => s.name === 'google')?.data as GoogleSettings)
      setAuth(response.data.find(s => s.name === 'auth0')?.data as Auth0Settings)
      setSettings(response.data)
    }
  }

  const save = async (name: string, prop: string, value: unknown) => {
    const setting = settings.find(s => s.name === name) || ({ name, data: {} } as Setting)
    const payload = {
      name,
      data: { ...setting.data, [prop]: value },
    }
    const response = await request<Setting>('setting', payload)
    if (response.status === 200) {
      dispatch(notify(`Setting ${name} saved`))
    } else {
      dispatch(notifyError(`Save ${name} failed: ${response.data}`))
    }
  }

  React.useEffect(() => {
    load()
  }, [])

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      <Typography variant="h5" component="h1" mb={1}>
        Settings
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item xs={8} md={10}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          value={true}
                          checked={system.disable}
                          onChange={e => save('system', 'disable', e.target.value)}
                        />
                      }
                      label="Maintenance Mode"
                    />
                    <FormControlLabel control={<Switch />} label="Enable Store" />
                    <FormControlLabel control={<Switch />} label="Enable Cookie Consent" />
                  </FormGroup>
                </Grid>
                <Grid
                  item
                  xs={4}
                  md={2}
                  sx={{
                    backgroundColor: 'success.main',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    filter: 'brightness(0.8)',
                  }}
                >
                  <Typography variant="h5">Running</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6}>
          <Card>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h5" component="h2">
                    Authentication
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6" component="h3">
                    New User Registrations
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <FormControlLabel control={<Switch />} label="Enable" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" component="h4">
                    Auth0 Setup
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Tenant" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Redirect Url" fullWidth />
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6" component="h3">
                    Automatically Configure Auth0
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <FormControlLabel control={<Switch />} label="Enable" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" component="p">
                    Auto setup only needs the `Client ID` and `Client Secret` from the API Explorer
                    Application:{' '}
                    <Link href="https://manage.auth0.com/dashboard" target="_blank">
                      Auth0 dashboard
                    </Link>{' '}
                    and go to API Explorer Application - Settings - copy Client ID and Secret into
                    Explorer ID and Secret
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <TextField label="Explorer Client ID" fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Explorer Client Secret" fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Client ID" fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Client Secret" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Audience" fullWidth />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6}>
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
                  <FormControlLabel control={<Switch />} label="Enable" />
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6" component="h5">
                    OneTap Onboarding
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  <FormControlLabel control={<Switch />} label="Enable" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" component="p">
                    <Link href="https://console.cloud.google.com/apis/credentials" target="_blank">
                      Project OAuth 2.0 Client ID and Secret (Click Create Credentials then OAuth
                      client ID)
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Client ID" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Client Secret" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Project ID" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Analytics ID" fullWidth />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
