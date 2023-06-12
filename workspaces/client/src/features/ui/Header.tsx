import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Link from '@mui/material/Link'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Badge from '@mui/material/Badge'
import Card from '@mui/material/Card'
import Paper from '@mui/material/Paper/Paper'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import { LockOpen, SettingsRounded, ShoppingCartCheckout, Warning } from '@mui/icons-material'
import { config } from '../../shared/config'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { patch } from '../app/slice'
import { patch as patchShop } from '../shop/slice'
import { Link as RouterLink } from 'react-router-dom'
import routes, { AppRoute } from '../../shared/routes'
import { logoutAsync } from '../app/thunks'
import { hasRole } from '../../shared/auth'

const links = routes.filter(route => route.link)
const profileLinks = routes.filter(route => route.profile)

export default function HeaderNavBar() {
  const locale = useAppSelector(state => state.app.locale)
  const maintenance = useAppSelector(state => state.app.settings?.system?.disable)
  const backgroundColor = maintenance ? 'error.dark' : undefined
  const items = useAppSelector(state => state.shop.items)
  const activeSubscription = useAppSelector(state => state.shop.activeSubscription)
  const wallet = useAppSelector(state => state.shop.wallet)
  const enableAuth = useAppSelector(state => state.app.settings?.system?.authProvider)
  const enableRegistrations = useAppSelector(
    state => state.app.settings?.system?.enableRegistration
  )
  const enableStore = useAppSelector(state => state.app.settings?.system?.enableStore)

  const dispatch = useAppDispatch()
  const authenticated = useAppSelector(state => state.app.token)
  const user = useAppSelector(state => state.app.user)
  const darkTheme = useAppSelector(state => state.app.darkMode)
  const drawerRightOpen = useAppSelector(state => state.app.drawerRightOpen)
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = (r?: AppRoute) => {
    if (r?.dialog) {
      dispatch(patch({ dialog: r.dialog }))
    }
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = (r?: AppRoute) => {
    if (r?.dialog) {
      dispatch(patch({ dialog: r.dialog }))
    }
    setAnchorElUser(null)
  }

  const handleDialog = (dialog: string) => {
    dispatch(patch({ dialog }))
    dispatch(patchShop({ activeStep: 0 }))
  }

  const handleThemeToggle = () => {
    dispatch(patch({ darkMode: !darkTheme }))
  }

  const handleMenuToggle = () => {
    dispatch(patch({ drawerRightOpen: !drawerRightOpen }))
  }

  const handleLogout = () => {
    dispatch(logoutAsync())
  }

  const handleLang = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(patch({ locale: e.target.value }))
  }

  return (
    <AppBar
      position="static"
      sx={{ maxHeight: '4rem', backgroundColor, backgroundImage: 'none !important', boxShadow: 0 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            {config.defaultTitle}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu()}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {links.map(route => (
                <MenuItem key={route.path}>
                  <Link
                    component={RouterLink}
                    to={route.dialog ? '#' : route.path}
                    underline="none"
                    onClick={() => handleDialog(route.dialog as string)}
                  >
                    {route.title}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            {config.defaultTitle}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'center' } }}>
            {links.map(route => (
              <Button
                key={route.path}
                onClick={() => handleCloseNavMenu(route)}
                component={RouterLink}
                to={route.dialog ? '#' : route.path}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {route.title}
              </Button>
            ))}
          </Box>

          {maintenance && (
            <Tooltip title="Maintenance Mode - Only Admins" color="warning">
              <Warning />
            </Tooltip>
          )}
          {enableStore && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Shopping">
                <Badge
                  color="secondary"
                  badgeContent={items
                    .map(i => i.quantity)
                    .reduce((prev, curr) => {
                      return prev + curr
                    }, 0)}
                >
                  <IconButton onClick={() => handleDialog('checkout')}>
                    <ShoppingCartCheckout />
                  </IconButton>
                </Badge>
              </Tooltip>
            </Box>
          )}
          {!user && (
            <>
              <Button
                variant="text"
                startIcon={<LockOpen />}
                onClick={() => handleDialog('onboard')}
                sx={{ color: 'white' }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ ml: 1 }}
                onClick={() => handleDialog('onboard.register')}
              >
                Start
              </Button>
            </>
          )}
          <Box sx={{ flexGrow: 0, ml: 1 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu}>
                {!user && <SettingsRounded />}
                {user && <Avatar src={user?.picture} alt={user?.firstName} />}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-profile"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={() => handleCloseUserMenu()}
            >
              {user && (
                <Paper
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '.1rem .5rem',
                    padding: '.5rem',
                    minWidth: '200px'
                  }}
                >
                  <Card>
                    <Typography>
                      Coins: {parseInt((wallet?.balance ?? 0) as unknown as string)}
                    </Typography>
                  </Card>
                  <Card>
                    <Typography>Membership: {activeSubscription?.title || 'None'}</Typography>
                  </Card>
                </Paper>
              )}
              {profileLinks
                .filter(r => (r.secure ? authenticated : authenticated ? !r.anon : true))
                .filter(route => (route.roles ? route.roles.every(r => hasRole(r)) : true))
                .filter(r =>
                  !enableAuth || !enableRegistrations ? !['/register'].includes(r.path) : true
                )
                .map(setting => (
                  <MenuItem
                    key={setting.path}
                    onClick={() => handleCloseUserMenu(setting)}
                    component={RouterLink}
                    to={setting.dialog ? '#' : setting.path.replace('/*', '')}
                  >
                    <Typography textAlign="center">{setting.title}</Typography>
                  </MenuItem>
                ))}
              <MenuItem onClick={handleMenuToggle}>
                <Typography textAlign="center">Drawer</Typography>
              </MenuItem>
              <MenuItem onClick={handleThemeToggle}>
                <Typography textAlign="center">Theme</Typography>
              </MenuItem>
              <MenuItem>
                <RadioGroup onChange={handleLang} value={locale}>
                  <FormControlLabel value="en" control={<Radio />} label="en" />
                  <FormControlLabel value="es" control={<Radio />} label="es" />
                </RadioGroup>
              </MenuItem>
              {authenticated && (
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
