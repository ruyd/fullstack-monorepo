import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabPanel from '../ui/TabPanel'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

export default function Settings() {
  const [value, setValue] = React.useState(0)
  const [value2, setValue2] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const handleChange2 = (event: React.SyntheticEvent, newValue: number) => {
    setValue2(newValue)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography>Settings</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="settings" variant="fullWidth">
          <Tab label="Item Two" />
          <Tab label="Item Two" />
          <Tab label="Item Two" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Cookie consent banner
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value2} onChange={handleChange2} aria-label="settings2">
          <Tab label="Item Two" />
          <Tab label="Item Two" />
          <Tab label="Item Two" />
        </Tabs>
      </Box>
      <TabPanel value={value2} index={0}>
        Item One2
      </TabPanel>
      <TabPanel value={value2} index={1}>
        Item Two2
      </TabPanel>
      <TabPanel value={value2} index={2}>
        Item Three2
      </TabPanel>
    </Box>
  )
}
