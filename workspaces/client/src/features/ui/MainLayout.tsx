import React from 'react'
import Header from './Header'
import ThemeSwitch from './Theme'
import '../../styles/index.css'
import DrawerRight from './Drawer'
import Routing, { RouteElement } from './Routing'
import Notifications from './Notifications'
import Footer from './Footer'
import LoadingLine from './LoadingLine'
import AuthProviders from '../profile/AuthProviders'
import { currentRoute } from 'src/shared/routes'
import Dialogs from './Dialogs'
import CssBaseline from '@mui/material/CssBaseline'
import SocketListener from '../app/SocketListener'
import { useAppSelector } from 'src/shared/store'

export function MainLayout() {
  const maintenance = useAppSelector(state => state.app.settings?.system?.disable)
  if (maintenance) return null

  const route = currentRoute()
  if (route?.cleanLayout)
    return (
      <ThemeSwitch>
        <RouteElement route={route} />
      </ThemeSwitch>
    )

  return (
    <React.Fragment>
      <ThemeSwitch>
        <CssBaseline />
        <LoadingLine />
        <Header />
        <main>
          <Routing />
        </main>
        <Notifications />
        <DrawerRight />
        <Footer />
        <Dialogs />
        <AuthProviders />
        <SocketListener />
      </ThemeSwitch>
    </React.Fragment>
  )
}
