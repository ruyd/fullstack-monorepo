import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './shared/store'
import CssBaseline from '@mui/material/CssBaseline'
import Header from './layout/Header'
import ThemeSwitch from './layout/ThemeSwitch'
import './index.css'
import DrawerRight from './layout/Drawer'
import { BrowserRouter } from 'react-router-dom'
import Routing from './layout/Routing'
import Notifications from './layout/Notifications'
import { HelmetProvider } from 'react-helmet-async'
import axios from 'axios'
import config from './shared/config'
import Footer from './layout/Footer'
import { QueryClient, QueryClientProvider } from 'react-query'

function App() {
  useEffect(() => {
    axios.defaults.baseURL = config.apiUrl
  }, [])
  return (
    <React.Fragment>
      <ThemeSwitch>
        <CssBaseline enableColorScheme />
        <Header />
        <Routing />
        <Notifications />
        <DrawerRight />
        <Footer />
      </ThemeSwitch>
    </React.Fragment>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!
const root = createRoot(container)
const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
)
