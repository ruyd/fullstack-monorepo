import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './shared/store'
import reportWebVitals from './reportWebVitals'
import './index.css'
import { Counter } from './features/canvas/Counter'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import NavBar from './components/NavBar'
import ThemeSwitch from './components/ThemeSwitch'

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <NavBar />
      <main>
        <Box sx={{}}>ddxd</Box>
      </main>
    </React.Fragment>
  )
}

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeSwitch>
        <App />
      </ThemeSwitch>
    </Provider>
  </React.StrictMode>
)

reportWebVitals()
