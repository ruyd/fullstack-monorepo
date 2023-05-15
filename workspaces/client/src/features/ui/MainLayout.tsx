import React from 'react'
import Header from './Header'
import DrawerRight from './Drawer'
import Routing, { RouteElement } from './Routing'
import Notifications from './Notifications'
import Footer from './Footer'
import LoadingLine from './LoadingLine'
import AuthProviders from '../profile/AuthProviders'
import { currentRoute } from '../../shared/routes'
import Dialogs from './Dialogs'
import CssBaseline from '@mui/material/CssBaseline'
import SocketListener from '../app/SocketListener'

export function MainLayout() {
  const route = currentRoute()
  if (route?.cleanLayout) {
    return <RouteElement route={route} />
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}
