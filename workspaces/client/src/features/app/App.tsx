import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { applyConfig } from '../../shared/config'
import { store } from '../../shared/store'
import config from '../../shared/config'
import '../../styles/index.css'
import { MainLayout } from '../layout/MainLayout'
import { GoogleOneTap } from '../../shared/GoogleOneTap'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

applyConfig()

export default function App() {
  return (
    <GoogleOneTap>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <HelmetProvider>
            <BrowserRouter basename={config.baseName}>
              <MainLayout />
            </BrowserRouter>
          </HelmetProvider>
        </Provider>
      </QueryClientProvider>
    </GoogleOneTap>
  )
}
