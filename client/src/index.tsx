import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './shared/store'
import reportWebVitals from './reportWebVitals'
import CssBaseline from '@mui/material/CssBaseline'
import HeaderNavBar from './layout/HeaderNavBar'
import MainSection from './layout/MainSection'
import ThemeSwitch from './layout/ThemeSwitch'
import './index.css'

function App() {
  return (
    <React.Fragment>
      <ThemeSwitch>
        <CssBaseline enableColorScheme />
        <HeaderNavBar />
        <MainSection />
      </ThemeSwitch>
    </React.Fragment>
  )
}

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

const perf = process.env.NODE_ENV !== 'production' ? console.log : () => {}
reportWebVitals(perf)
