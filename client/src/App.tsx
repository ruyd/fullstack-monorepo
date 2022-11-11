import React from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query'
import { applyConfig } from './shared/config'
import { store } from './shared/store'
import CssBaseline from '@mui/material/CssBaseline'
import Header from './layout/Header'
import ThemeSwitch from './layout/ThemeSwitch'
import './styles/index.css'
import DrawerRight from './layout/Drawer'
import { BrowserRouter } from 'react-router-dom'
import Routing from './layout/Routing'
import Notifications from './layout/Notifications'
import { HelmetProvider } from 'react-helmet-async'
import Footer from './layout/Footer'
import config from './shared/config'
import LoadingLine from './layout/LoadingLine'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

applyConfig()

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
      </ThemeSwitch>
    </React.Fragment>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <HelmetProvider>
          <BrowserRouter basename={config.baseName}>
            <MainLayout />
          </BrowserRouter>
        </HelmetProvider>
      </Provider>
    </QueryClientProvider>
  )
}
