import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { store } from '../../shared/store'
import { config } from '../../shared/config'
import '../../styles/index.css'
import { MainLayout } from '../ui/MainLayout'
import ConfigProvider from './ConfigProvider'
import axios from 'axios'
import ThemeSwitch from '../ui/Theme'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, cacheTime: 3000, staleTime: 3000 } },
})

axios.defaults.baseURL = config.backendUrl

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <HelmetProvider>
          <BrowserRouter basename={config.baseName}>
            <ThemeSwitch>
              <ConfigProvider>
                <MainLayout />
              </ConfigProvider>
            </ThemeSwitch>
          </BrowserRouter>
        </HelmetProvider>
      </Provider>
    </QueryClientProvider>
  )
}
