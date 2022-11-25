/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import Box from '@mui/material/Box'
import config from 'src/shared/config'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { loadDataAsync, useGet } from './thunks'
import React from 'react'
import _ from 'lodash'
import { Alert, AppBar, CircularProgress, InputAdornment, TextField } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { PagedResult } from '../../../../lib/src/types'
import DataTable from './DataTable'
import { Preview, Search } from '@mui/icons-material'

const excluded = ['history']

export interface PagingProps {
  page: number
  limit: number
}

/**
 *
 * Use DataGrid for generic editirng and tables for special Users/Orders to compare them
 */
export default function Data() {
  const [searchParams] = useSearchParams()
  const model = searchParams.get('model') || ''
  const [paging, setPaging] = React.useState<PagingProps>({ limit: 100, page: 0 })
  const { data, isLoading, error } = useGet<PagedResult>(
    model,
    `${model}`,
    {
      enabled: !!model,
    },
    paging,
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <>
        {model}
        {isLoading && <CircularProgress />}
        {error && <Alert>{JSON.stringify(error)}</Alert>}
        <Box>
          <TextField
            placeholder="Search..."
            variant="filled"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <DataTable
          data={data}
          paging={paging}
          onPaging={newValues => setPaging(newValues as PagingProps)}
        />
        {/* <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <TablePagination
          component="div"
          count={data?.total || 0}
          rowsPerPage={paging.limit || 0}
          page={paging.page || 0}
          onPageChange={(event, newPage) => {
            setPaging(prev => ({ ...prev, page: newPage }))
          }}
          onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPaging(prev => ({ ...prev, limit: Number(event.target.value) }))
          }}
        />
      </AppBar> */}
      </>
    </Box>
  )
}
