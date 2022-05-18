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
import { flexbox } from '@mui/system'
import Stack from '@mui/material/Stack'
import { Grid } from '@mui/material'

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <NavBar />
      <Container maxWidth={false} disableGutters sx={{ display: 'flex' }}>
        <Box sx={{ bgcolor: '#cfe8fc' }}>ddd</Box>
      </Container>
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

reportWebVitals()
