import React from 'react'
import Box from '@mui/material/Box'
import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { useAppDispatch } from '../../../shared/store'
import { Setting, PagedResult, SettingData, SettingType, SettingState, AuthProviders } from '@lib'
import { get, notify, notifyError, request } from '../../app'
import debouncer from '../../../shared/debouncer'
import _ from 'lodash'
import SettingsForAuth0 from './SettingsForAuth0'
import SettingsForGoogle from './SettingsForGoogle'

export default function Settings() {
  const dispatch = useAppDispatch()
  const [data, setData] = React.useState<SettingState>()
  const saveAsync = async (setting: Setting) => {
    const response = await request<Setting>('setting', { ...setting })
    if (response.status === 200) {
      dispatch(notify(`${setting.name} saved`))
    } else {
      dispatch(notifyError(`Save ${setting.name} failed: ${response.data}`))
    }
  }

  const save = (name: SettingType, prop: string, value: unknown) => {
    const existing = data ? data[name] || {} : {}
    const newValue = _.set(existing, prop, value)
    const newData = { ...data, [name]: newValue } as { [k in SettingType]: SettingData[k] }
    const setting = { name, data: newValue } as Setting
    setData(newData)
    debouncer(setting.name, () => saveAsync(setting))
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
                <Grid item xs={4} md={5}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!data?.system?.disable}
                          onChange={() => save('system', 'disable', !data?.system?.disable)}
                        />
                      }
                      label="Maintenance Mode"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!data?.system?.enableCookieConsent}
                          onChange={() =>
                            save(
                              'system',
                              'enableCookieConsent',
                              !data?.system?.enableCookieConsent
                            )
                          }
                        />
                      }
                      label="Enable Cookie Consent"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={4} md={5}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!data?.system?.enableStore}
                          onChange={() => save('system', 'enableStore', !data?.system?.enableStore)}
                        />
                      }
                      label="Enable Store"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!data?.system?.enableShippingAddress}
                          onChange={() =>
                            save(
                              'system',
                              'enableShippingAddress',
                              !data?.system?.enableShippingAddress
                            )
                          }
                        />
                      }
                      label="Enable Shipping Address"
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
                    filter: 'brightness(0.8)'
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
                        onChange={() =>
                          save('system', 'enableRegistration', !data?.system?.enableRegistration)
                        }
                      />
                    }
                    label="Enable"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={data?.internal?.authProvider || AuthProviders.Development}
                      onChange={e => save('internal', 'authProvider', e.target.value)}
                    >
                      <FormControlLabel value="fake" control={<Radio />} label="Development" />
                      <FormControlLabel value="firebase" control={<Radio />} label="Firebase" />
                      <FormControlLabel value="auth0" control={<Radio />} label="Auth0" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {data?.internal?.authProvider === AuthProviders.Development && (
                  <Typography>Dev</Typography>
                )}
                {data?.internal?.authProvider === AuthProviders.Firebase && (
                  <Typography>Firebase</Typography>
                )}
                {data?.internal?.authProvider === AuthProviders.Auth0 && (
                  <SettingsForAuth0 data={data as SettingState} save={save} />
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6}>
          <SettingsForGoogle data={data as SettingState} save={save} />
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
                        onChange={() =>
                          save(
                            'system',
                            'paymentMethods.stripe.enabled',
                            !data?.system?.paymentMethods?.stripe?.enabled
                          )
                        }
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
                        checked={!!data?.system?.paymentMethods?.stripe?.subscriptionsEnabled}
                        onChange={() =>
                          save(
                            'system',
                            'paymentMethods.stripe.subscriptionsEnabled',
                            !data?.system?.paymentMethods?.stripe?.subscriptionsEnabled
                          )
                        }
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
                        checked={!!data?.system?.paymentMethods?.stripe?.identityEnabled}
                        onChange={() =>
                          save(
                            'system',
                            'paymentMethods.stripe.identityEnabled',
                            !data?.system?.paymentMethods?.stripe?.identityEnabled
                          )
                        }
                      />
                    }
                    label="Enable"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Publishable Key"
                    fullWidth
                    value={data?.system?.paymentMethods?.stripe?.publishableKey || ''}
                    onChange={e =>
                      save('system', 'paymentMethods.stripe.publishableKey', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Secret key"
                    fullWidth
                    value={data?.internal?.secrets?.stripe?.apiKey || ''}
                    onChange={e => save('internal', 'secrets.stripe.apiKey', e.target.value)}
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
                        checked={!!data?.system?.paymentMethods?.paypal?.enabled}
                        onChange={() =>
                          save(
                            'system',
                            'paymentMethods.paypal.enabled',
                            !data?.system?.paymentMethods?.paypal?.enabled
                          )
                        }
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
                        checked={!!data?.system?.paymentMethods?.paypal?.subscriptionsEnabled}
                        onChange={() =>
                          save(
                            'system',
                            'paymentMethods.paypal.subscriptionsEnabled',
                            !data?.system?.paymentMethods?.paypal?.subscriptionsEnabled
                          )
                        }
                      />
                    }
                    label="Enable"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="API Secret"
                    fullWidth
                    value={data?.internal?.secrets?.paypal?.apiKey || ''}
                    onChange={e => save('internal', 'secrets.paypal.apiKey', e.target.value)}
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
