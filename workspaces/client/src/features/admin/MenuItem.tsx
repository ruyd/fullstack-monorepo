import React from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

export interface MenuModel {
  text: string
  icon: React.ReactNode
  children?: MenuModel[]
}

export default function MenuItem({ text, icon, children }: MenuModel) {
  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children?.map(child => (
            <ListItemButton sx={{ pl: 4 }} key={child.text}>
              <ListItemIcon>{child.icon}</ListItemIcon>
              <ListItemText primary={child.text} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  )
}
