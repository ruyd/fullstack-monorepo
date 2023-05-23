import Box from '@mui/material/Box'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard'
import Data from './Data'
import Menu from './Menu'
import Orders from './Orders'
import Settings from './Settings/index'
import Subscriptions from './Subscriptions'
import Users from './Users'

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
      <Box
        style={{
          flexGrow: 1,
          margin: '1rem .5rem -2rem .5rem',
          display: 'flex'
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="data" element={<Data />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="subscriptions" element={<Subscriptions />} />
        </Routes>
      </Box>
    </Box>
  )
}
