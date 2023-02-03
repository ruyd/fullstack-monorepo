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
import { useAppDispatch, useAppSelector } from '../../shared/store'
import {
  Setting,
  SystemSettings,
  GoogleSettings,
  Auth0Settings,
  PagedResult,
  SettingData,
  SettingType,
} from '@lib'
import { get, notify, notifyError, request } from '../app'

export default function Settings() {
  const dispatch = useAppDispatch()
  const [data, setData] = React.useState<{ [k in SettingType]: SettingData[k] }>()

  const delay = 1000
  type SetFn = React.Dispatch<React.SetStateAction<unknown>>
  const debouncer = React.useRef<{ [key: string]: number | undefined }>({})
  const saveAsync = async (setting: Setting) => {
    const response = await request<Setting>('setting', { ...setting })
    if (response.status === 200) {
      dispatch(notify(`${setting.name} saved`))
    } else {
      dispatch(notifyError(`Save ${setting.name} failed: ${response.data}`))
    }
  }

  const bounce = (setting: Setting) => {
    if (debouncer.current[setting.name]) {
      window.clearTimeout(debouncer.current[setting.name])
    }
    const timer = window.setTimeout(() => saveAsync(setting), delay)
    debouncer.current[setting.name] = timer
  }

  const save = (name: SettingType, prop: string, value: unknown) => {
    const existing = data ? data[name] : {}
    const setting = { name, data: { ...existing, [prop]: value } } as Setting
    setData({ ...data, [name]: setting.data } as { [k in SettingType]: SettingData[k] })
    bounce(setting)
  }

  const load = async () => {
    const response = await get<PagedResult<Setting>>('setting')
    const result = response.data.items || []
    const temp = {} as { [key: string]: unknown }
    for (const s of result) {
      temp[s.name] = s.data
    }
    setData(temp as { [k in SettingType]: SettingData[k] })
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
                          checked={!!data?.system?.disable}
                          onChange={e => save('system', 'disable', !data?.system?.disable)}
                        />
                      }
                      label="Maintenance Mode"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!data?.system?.enableStore}
                          onChange={e => save('system', 'enableStore', !data?.system?.enableStore)}
                        />
                      }
                      label="Enable Store"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!data?.system?.enableCookieConsent}
                          onChange={e =>
                            save(
                              'system',
                              'enableCookieConsent',
                              !data?.system?.enableCookieConsent,
                            )
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
                    backgroundColor: data?.system?.disable ? 'error.dark' : 'success.dark',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s ease-out',
                    filter: 'brightness(0.8)',
                  }}
                >
                  <Typography variant="h5">
                    {data?.system?.disable ? 'Offline' : 'Running'}
                  </Typography>
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
                        checked={!!data?.system?.enableRegistration}
                        onChange={e =>
                          save('system', 'enableRegistration', !data?.system?.enableRegistration)
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
                        checked={!!data?.auth0?.enabled}
                        onChange={e => save('auth0', 'enabled', !data?.auth0?.enabled)}
                      />
                    }
                    label="Enable"
                  />
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
                    value={data?.auth0?.clientSecret || ''}
                    onChange={e => save('auth0', 'clientSecret', e.target.value)}
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
                <Grid item xs={8}>
                  <Typography variant="h6" component="h3">
                    Automatically Configure Auth0
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!data?.auth0?.sync}
                        onChange={e => save('auth0', 'sync', !data?.auth0?.sync)}
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
                    value={data?.auth0?.explorerId || ''}
                    onChange={e => save('auth0', 'explorerId', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Explorer Client Secret"
                    fullWidth
                    value={data?.auth0?.explorerSecret || ''}
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
                        checked={!!data?.google?.enabled}
                        onChange={e => save('google', 'enabled', !data?.google?.enabled)}
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
                        onChange={e =>
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
                      Project OAuth 2.0 Client ID and Secret (Click Create Credentials then OAuth
                      client ID)
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
                    value={data?.google?.clientSecret || ''}
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
                    value={data?.google?.projectId || ''}
                    onChange={e => save('google', 'projectId', e.target.value)}
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
        </Grid>
        <Grid item md={6}>
          <Card>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h5" component="h2">
                    Stripe
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6" component="h3">
                    Payments
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!data?.system?.paymentMethods?.stripe?.enabled}
                        onChange={e => save('system', 'enabled', !data?.google?.enabled)}
                      />
                    }
                    label="Enable"
                  />
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6" component="h3">
                    Subscriptions
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!data?.system?.paymentMethods?.stripe?.enabled}
                        onChange={e => save('system', 'enabled', !data?.google?.enabled)}
                      />
                    }
                    label="Enable"
                  />
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6" component="h3">
                    Identity Verification
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!data?.system?.paymentMethods?.stripe?.enabled}
                        onChange={e => save('system', 'enabled', !data?.google?.enabled)}
                      />
                    }
                    label="Enable"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Publishable Key"
                    fullWidth
                    value={data?.google?.clientId || ''}
                    onChange={e => save('google', 'clientId', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="API Secret"
                    fullWidth
                    value={data?.google?.clientSecret || ''}
                    onChange={e => save('google', 'clientSecret', e.target.value)}
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
                    Paypal
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6" component="h3">
                    Payments
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!data?.system?.paymentMethods?.stripe?.enabled}
                        onChange={e => save('system', 'enabled', !data?.google?.enabled)}
                      />
                    }
                    label="Enable"
                  />
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6" component="h3">
                    Subscriptions
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!data?.system?.paymentMethods?.stripe?.enabled}
                        onChange={e => save('system', 'enabled', !data?.google?.enabled)}
                      />
                    }
                    label="Enable"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="API Secret"
                    fullWidth
                    value={data?.google?.clientId || ''}
                    onChange={e => save('google', 'clientId', e.target.value)}
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
