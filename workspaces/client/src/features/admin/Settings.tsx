/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'

import Box from '@mui/material/Box'
import {
  Card,
  CardContent,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useAppDispatch } from '../../shared/store'
import { Setting, SystemSettings, GoogleSettings, Auth0Settings, PagedResult } from '@lib'
import { get, notify, notifyError, request } from '../app'
import { debounce } from 'lodash'

export default function Settings() {
  const dispatch = useAppDispatch()
  const throttle = React.useRef<number>(0)
  const [system, setSystem] = React.useState<SystemSettings | undefined>({
    disable: false,
    enableStore: false,
    enableAuth: true,
  })
  const [google, setGoogle] = React.useState<GoogleSettings | undefined>({})
  const [auth0, setAuth0] = React.useState<Auth0Settings | undefined>({
    tenant: '',
    redirectUrl: '',
    enabled: false,
  })
  const [settings, setSettings] = React.useState<Setting[]>([])
  type SetFn = React.Dispatch<React.SetStateAction<unknown>>

  const save = async (name: string, prop: string, value: unknown) => {
    const sets: {
      [key: string]: SetFn
    } = {
      system: setSystem as SetFn,
      google: setGoogle as SetFn,
      auth0: setAuth0 as SetFn,
    }
    const setting = settings.find(s => s.name === name) || ({ name, data: {} } as Setting)
    const data = { ...setting.data, [prop]: value }
    const payload = {
      name,
      data,
    }
    const response = await request<Setting>('setting', payload)
    if (response.status === 200) {
      dispatch(notify(`${name}/${prop} saved`))
      const update = sets[name]
      update(data)
      setSettings(settings.map(s => (s.name === name ? response.data : s)))
    } else {
      dispatch(notifyError(`Save ${prop} failed: ${response.data}`))
    }
  }

  const load = async () => {
    const response = await get<PagedResult<Setting>>('setting')
    const result = response.data.items || []
    // for (const setting of result) {
    //   sets[setting.name](setting.data)
    // }
    setSystem(result.find(s => s.name === 'system')?.data as SystemSettings)
    setGoogle(result.find(s => s.name === 'google')?.data as GoogleSettings)
    setAuth0(result.find(s => s.name === 'auth0')?.data as Auth0Settings)
    setSettings(result)
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
                          checked={!!system?.disable}
                          onChange={e => save('system', 'disable', !system?.disable)}
                        />
                      }
                      label="Maintenance Mode"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!system?.enableStore}
                          onChange={e => save('system', 'enableStore', !system?.enableStore)}
                        />
                      }
                      label="Enable Store"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!system?.enableCookieConsent}
                          onChange={e =>
                            save('system', 'enableCookieConsent', !system?.enableCookieConsent)
                          }
                        />
                      }
                      label="Enable Cookie Consent"
                    />
                  </FormGroup>
                </Grid>
                <Grid
                  item
                  xs={4}
                  md={2}
                  sx={{
                    backgroundColor: system?.disable ? 'error.dark' : 'success.dark',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s ease-out',
                    filter: 'brightness(0.8)',
                  }}
                >
                  <Typography variant="h5">{system?.disable ? 'Offline' : 'Running'}</Typography>
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
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!system?.enableRegistration}
                        onChange={e =>
                          save('system', 'enableRegistration', !system?.enableRegistration)
                        }
                      />
                    }
                    label="Enable"
                  />
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6" component="h3">
                    Auth0
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!auth0?.enabled}
                        onChange={e => save('auth0', 'enabled', !auth0?.enabled)}
                      />
                    }
                    label="Enable"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Tenant"
                    fullWidth
                    value={auth0?.tenant || ''}
                    required
                    onChange={e => save('auth0', 'tenant', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Redirect Url"
                    fullWidth
                    required
                    value={auth0?.redirectUrl || ''}
                    onChange={e => save('auth0', 'redirectUrl', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Client ID"
                    fullWidth
                    value={auth0?.clientId || ''}
                    onChange={e => save('auth0', 'clientId', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Client Secret"
                    fullWidth
                    value={auth0?.clientSecret || ''}
                    onChange={e => save('auth0', 'clientSecret', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Audience"
                    fullWidth
                    value={auth0?.clientAudience || ''}
                    onChange={e => save('auth0', 'clientAudience', e.target.value)}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6" component="h3">
                    Automatically Configure Auth0
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!auth0?.sync}
                        onChange={e => save('auth0', 'sync', !auth0?.sync)}
                      />
                    }
                    label="Enable"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" component="p" mb={1}>
                    Auto configure application and create resources in Auth0. Only needs the `Client
                    ID` and `Client Secret` from the API Explorer Application:{' '}
                    <Link href="https://manage.auth0.com/dashboard" target="_blank">
                      Open Auth0 dashboard
                    </Link>{' '}
                    and go to API Explorer Application - Settings - copy Client ID and Secret
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Explorer Client ID"
                    fullWidth
                    value={auth0?.explorerId || ''}
                    onChange={e => save('auth0', 'explorerId', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Explorer Client Secret"
                    fullWidth
                    value={auth0?.explorerSecret || ''}
                    onChange={e => save('auth0', 'explorerSecret', e.target.value)}
                  />
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
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!google?.enabled}
                        onChange={e => save('google', 'enabled', !google?.enabled)}
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
                        checked={!!system?.enableOneTapLogin}
                        onChange={e =>
                          save('system', 'enableOneTapLogin', !system?.enableOneTapLogin)
                        }
                      />
                    }
                    label="Enable"
                  />
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
                  <TextField
                    label="Client ID"
                    fullWidth
                    value={google?.clientId || ''}
                    onChange={e => save('google', 'clientId', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Client Secret"
                    fullWidth
                    value={google?.clientSecret || ''}
                    onChange={e => save('google', 'clientSecret', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" component="h4">
                    Cloud
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Project ID"
                    fullWidth
                    value={google?.projectId || ''}
                    onChange={e => save('google', 'projectId', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Analytics ID"
                    fullWidth
                    value={google?.analyticsId || ''}
                    onChange={e => save('google', 'analyticsId', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
