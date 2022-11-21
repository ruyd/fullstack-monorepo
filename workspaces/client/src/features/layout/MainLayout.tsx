import React from 'react'
import Header from './Header'
import ThemeSwitch from './ThemeSwitch'
import '../../styles/index.css'
import DrawerRight from './Drawer'
import Routing, { RouteElement } from './Routing'
import Notifications from './Notifications'
import Footer from './Footer'
import LoadingLine from './LoadingLine'
import AuthProviders from '../profile/AuthProviders'
import { currentRoute } from 'src/shared/routes'
import Dialogs from './Dialogs'

export function MainLayout() {
  const route = currentRoute()
  if (route?.popup) return <RouteElement route={route} />

  return (
    <React.Fragment>
      <ThemeSwitch>
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
      </ThemeSwitch>
    </React.Fragment>
  )
}
