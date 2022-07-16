import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query'
import { applyConfig } from './shared/config'
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
import Footer from './layout/Footer'

applyConfig()

function App() {
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
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, cacheTime: 0 } },
})

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
