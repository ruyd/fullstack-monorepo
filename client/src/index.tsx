import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query'
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
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
)
