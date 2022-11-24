/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from '@mui/material/Box'
import { Link } from 'react-router-dom'
import config from '../../shared/config'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import { Chip, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { useAppSelector } from 'src/shared/store'

export default function Menu({ ...props }) {
  const data = useAppSelector(state => state.admin.data)
  const [active, setActive] = React.useState<string>()
  const home = config.admin.path
  return (
    <Box {...props}>
      <List>
        <ListItemButton component={Link} to={`${home}`}>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        {config.admin.models?.map(name => (
          <ListItemButton key={name} component={Link} to={`${home}/data?model=${name}`}>
            <ListItemText primary={name} />
            <ListItemIcon />
            <Chip label={data[name]?.total || 0} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
