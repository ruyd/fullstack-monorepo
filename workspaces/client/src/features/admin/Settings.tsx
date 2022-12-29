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
import { get, request } from '../app'
export default function Settings() {
  const dispatch = useAppDispatch()
  const [data, setData] = React.useState({})
  const [settings, setSettings] = React.useState<Setting[]>([])
  const [value, setValue] = React.useState(0)
  const [value2, setValue2] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleChange2 = (event: React.SyntheticEvent, newValue: number) => {
    setValue2(newValue)
  }

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const payload = {} as Record<string, unknown>
    data.forEach((value, key) => (payload[key] = value))
  }

  const load = async () => {
    const response = await get<Setting[]>('setting')
    if (Array.isArray(response.data)) {
      setSettings(response.data)
    }
  }

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setData({ ...data, [name]: value })
  }

  // dispatch(settingAsync(data))

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
                    <FormControlLabel control={<Switch />} label="Maintenance Mode" />
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
                      Project OAuth 2.0 Client ID and Secret (Click Create Credentials then OAth
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
