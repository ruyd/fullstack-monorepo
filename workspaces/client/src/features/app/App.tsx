import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { applyConfig } from '../../shared/config'
import { store } from '../../shared/store'
import config from '../../shared/config'
import '../../styles/index.css'
import { MainLayout } from '../layout/MainLayout'
import { GoogleOneTap } from '../profile/GoogleOneTap'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

applyConfig()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <GoogleOneTap>
          <HelmetProvider>
            <BrowserRouter basename={config.baseName}>
              <MainLayout />
            </BrowserRouter>
          </HelmetProvider>
        </GoogleOneTap>
      </Provider>
    </QueryClientProvider>
  )
}
