import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { applyConfig } from '../../shared/config'
import { store } from '../../shared/store'
import config from '../../shared/config'
import '../../styles/index.css'
import { MainLayout } from '../ui/MainLayout'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, cacheTime: 3000, staleTime: 3000 } },
})

applyConfig()

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
