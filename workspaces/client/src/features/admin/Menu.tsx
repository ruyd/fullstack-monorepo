/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListIcon from '@mui/icons-material/List'
import AdbIcon from '@mui/icons-material/Adb'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import StorageIcon from '@mui/icons-material/Storage'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch } from './slice'
import { config } from 'src/shared/config'
import Collapse from '@mui/material/Collapse'
import {
  ExpandLess,
  ExpandMore,
  PersonSearch,
  Settings,
  StarBorder,
  VerifiedUserSharp,
} from '@mui/icons-material'
import MenuItem, { MenuModel } from './MenuItem'
import { Button } from '@mui/material'

const drawerWidth = 250

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
)
/**
 * - 1 level deep
 * - collapse
 * - active item
 * @returns
 */
export default function Menu(): JSX.Element {
  const theme = useTheme()
  const activeMenuItem = useAppSelector(state => state.admin.activeMenuItem)
  const open = useAppSelector(state => state.admin.menuOpen)
  const dispatch = useAppDispatch()
  const handleOpenClose = () => {
    dispatch(patch({ menuOpen: !open }))
  }

  const OpenIcon = () => (theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />)
  const CloseIcon = () => (theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />)

  const getIcon = (name: string) => {
    const dict: Record<string, React.ReactNode> = {}
    return dict[name] || <ListIcon />
  }

  const onChange = (item: MenuModel) => {
    dispatch(patch({ activeMenuItem: item.text }))
  }

  const items: MenuModel[] = [
    { text: 'Dashboard', icon: <AdbIcon />, path: '/' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
    { text: 'Users', icon: <PersonSearch />, path: '/users' },
    {
      text: 'Data',
      icon: <StorageIcon />,
      children: config.admin.models?.map(model => ({
        text: model,
        path: `/data?model=${model}`,
        icon: getIcon(model),
      })),
    },
  ]

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        {open && (
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: { xs: 'none', md: 'flex', flexGrow: 1 },
              fontFamily: 'monospace',
              color: 'inherit',
              textDecoration: 'none',
              justifyContent: 'center',
              marginRight: '-1.5rem',
            }}
          >
            <Button fullWidth onClick={handleOpenClose}>
              ADMIN
            </Button>
          </Typography>
        )}

        <IconButton onClick={handleOpenClose}>{open ? <OpenIcon /> : <CloseIcon />}</IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ ml: 0.5 }}>
        {items.map((item, index) => (
          <MenuItem
            key={index}
            item={item}
            active={item.text === activeMenuItem}
            onChange={() => dispatch(patch({ activeMenuItem: item.text }))}
          />
        ))}
      </List>
      <Divider />
    </Drawer>
  )
}
