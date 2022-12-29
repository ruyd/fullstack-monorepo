/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabPanel from '../ui/TabPanel'
import Box from '@mui/material/Box'
import {
  Card,
  FormControl,
  FormControlLabel,
  FormGroup,
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
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h5" component="h1">
        Settings
      </Typography>
      <FormGroup>
        <FormControlLabel control={<Switch />} label="Maintenance (Set Offline)" />
        <FormControlLabel control={<Switch />} label="Enable Google OneTap" />
        <FormControlLabel control={<Switch />} label="Enable Registrations" />
        <FormControlLabel control={<Switch />} label="Enable Store" />
        <FormControlLabel control={<Switch />} label="Show Cookie Consent" />
      </FormGroup>
      <Card title="Google">
        <FormControl>
          <TextField label="Client ID" />
        </FormControl>
        <FormControl>
          <TextField label="Client Secret" />
        </FormControl>
        <FormControl>
          <TextField label="Project ID" />
        </FormControl>
        <FormControl>
          <TextField label="Analytics ID" />
        </FormControl>
      </Card>
      <Card title="Auth0">
        <FormControl>
          <TextField label="Tenant" />
        </FormControl>
        <FormControl>
          <TextField label="Explorer ID" />
        </FormControl>
        <FormControl>
          <TextField label="Explorer Secret" />
        </FormControl>
        <FormControl>
          <TextField label="Client ID" />
        </FormControl>
        <FormControl>
          <TextField label="Client Secret" />
        </FormControl>
        <FormControl>
          <TextField label="Audience" />
        </FormControl>
        <FormControl>
          <TextField label="Redirect Url" />
        </FormControl>
      </Card>
    </Box>
  )
}
