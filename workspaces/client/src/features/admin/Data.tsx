/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import Box from '@mui/material/Box'
import config from 'src/shared/config'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { loadDataAsync, useGet } from './thunks'
import React from 'react'
import CircularProgressWithLabel from '../ui/CircularProgressWithLabel'
import _ from 'lodash'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Alert, ListItemText } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { PagedResult } from '../../../../lib/src/types'
import DataTable from './DataTable'

const excluded = ['history']

export default function Data() {
  const [searchParams] = useSearchParams()
  const model = searchParams.get('model') || 'error'
  const darkMode = useAppSelector(state => state.app.darkMode)
  const { data, isLoading, error } = useGet<PagedResult>(model, `${model}`)

  const first = data?.items?.[0] || ({} as Record<string, unknown>)
  const columns = Object.keys(first)
    .filter(key => typeof first[key] !== 'object')
    .map(key => ({
      name: key,
      header: key,
      defaultWidth: 170,
    }))

  return (
    <Box>
      <>
        {model}
        {isLoading && <CircularProgressWithLabel value={100} />}
        {error && <Alert>{JSON.stringify(error)}</Alert>}
        <DataTable data={data} />
      </>
    </Box>
  )
}
