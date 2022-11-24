/* eslint-disable no-console */
import Box from '@mui/material/Box'
import config from 'src/shared/config'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { loadDataAsync } from './thunks'
import React from 'react'
import CircularProgressWithLabel from '../layout/CircularProgressWithLabel'

export default function Data() {
  const path = config.admin.path + '/data'
  const current = window.location.pathname.replace(path, '')
  const data = useAppSelector(state => state.admin.data[current])
  const loading = useAppSelector(state => state.admin.loading)
  console.log('data', current)
  // const { data } = useGet<PagedResult>(current, `${current}`, {
  //   cacheTime: 10000,
  //   staleTime: 12000,
  // })

  const dispatch = useAppDispatch()
  const darkMode = useAppSelector(state => state.app.darkTheme)

  React.useEffect(() => {
    if (current) {
      dispatch(loadDataAsync(current))
    }
  }, [current, dispatch])

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
      {loading && <CircularProgressWithLabel value={100} title="dddd" />}
      <ReactDataGrid
        dataSource={data?.items || []}
        columns={columns}
        theme={darkMode ? 'dark' : 'light'}
      />
    </Box>
  )
}
