/* eslint-disable @typescript-eslint/no-unused-vars */
// import '@inovua/reactdatagrid-community/index.css'
// import '@inovua/reactdatagrid-community/theme/default-dark.css'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard'
import Data from './Data'
import Menu from './Menu'

/**
 * Intent: App console look and feel
 * - Sticky menu and footer
 * - data grid
 * - home
 * - active users
 * - recent activity
 * - recent errors
 */
export default function Admin(): JSX.Element {
  return (
    <Box sx={{ display: 'flex' }}>
      <Menu />
      <Box style={{ flexGrow: 1, padding: '1rem', maxWidth: '96w' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="data" element={<Data />} />
        </Routes>
      </Box>
    </Box>
  )
}
