import React from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Link } from 'react-router-dom'
import config from 'src/shared/config'

export interface MenuModel {
  text: string
  icon?: React.ReactNode
  path: string
  children?: MenuModel[]
}

export default function MenuItem({ item: { text, icon, children, path } }: { item: MenuModel }) {
  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <ListItemButton onClick={handleClick} component={Link} to={`${config.admin.path}${path}`}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
        {children ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children?.map(child => (
            <ListItemButton
              sx={{ pl: 4 }}
              key={child.text}
              component={Link}
              to={`${config.admin.path}${child.path}`}
            >
              {child.icon ? <ListItemIcon>{child.icon}</ListItemIcon> : null}
              <ListItemText primary={child.text} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  )
}
