/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from '@mui/material/Box'
import config from 'src/shared/config'
import DataTable from './DataTable'
import axios from 'axios'
import { PagedResult } from '../../../../lib/src/types'
import React from 'react'
import { useGet } from '../app'

export default function Data() {
  const path = config.admin.path
  const current = window.location.pathname.replace(path, '')
  const { data } = useGet<PagedResult>(current, `/${current}`)
  return (
    <Box>
      <DataTable data={data as PagedResult} />
    </Box>
  )
}
