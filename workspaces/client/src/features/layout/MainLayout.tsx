import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Header from './Header'
import ThemeSwitch from './ThemeSwitch'
import '../../styles/index.css'
import DrawerRight from './Drawer'
import Routing from './Routing'
import Notifications from './Notifications'
import Footer from './Footer'
import LoadingLine from './LoadingLine'
import AuthProviders from '../profile/AuthProviders'

export function MainLayout() {
  return (
    <React.Fragment>
      <ThemeSwitch>
        <CssBaseline enableColorScheme />
        <LoadingLine />
        <Header />
        <main>
          <Routing />
        </main>
        <Notifications />
        <DrawerRight />
        <Footer />
        <AuthProviders />
      </ThemeSwitch>
    </React.Fragment>
  )
}
