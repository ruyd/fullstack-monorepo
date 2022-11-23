import { Container } from '@mui/material'
import Box from '@mui/material/Box'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard'
import Data from './Data'
import Menu from './Menu'

export default function Admin(): JSX.Element {
  return (
    <Container maxWidth={false}>
      <Box>
        <Menu />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="data" element={<Data />} />
        </Routes>
      </Box>
    </Container>
  )
}
