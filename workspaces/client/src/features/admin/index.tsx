/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard'
import Data from './Data'
import Menu from './Menu'

export default function Admin(): JSX.Element {
  return (
    <Grid container>
      <Grid item xs={2}>
        <Menu />
      </Grid>
      <Grid item xs={10}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="data/*" element={<Data />} />
        </Routes>
        {/* <Data /> */}
      </Grid>
    </Grid>
  )
}
