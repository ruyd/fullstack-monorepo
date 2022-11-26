/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import Box from '@mui/material/Box'
import config from 'src/shared/config'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { loadDataAsync, request, useGet } from './thunks'
import React, { ChangeEvent } from 'react'
import _ from 'lodash'
import {
  Alert,
  AppBar,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  debounce,
} from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { PagedResult, GridPatchProps } from '@shared/lib'
import DataTable from './DataTable'
import SearchIcon from '@mui/icons-material/Search'
import { Method } from '../app/thunks'
import { notify } from '../app'

const excluded = ['history']

export interface PagingProps {
  page: number
  limit: number
}

export default function Data() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const [searchText, setSearchText] = React.useState('')
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
  const modelPlural = !model ? '' : _.capitalize(model) + (model?.endsWith('s') ? '' : 's')

  const onEdit = async (params: GridPatchProps) => {
    const response = await request(`${model}`, params, Method.PATCH)
    if (response) {
      dispatch(notify('Updated'))
    }
  }

  const handleSearch: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =
    React.useCallback(e => {
      setSearchText(e.target.value)
    }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          {modelPlural} ({data?.total || 0})
        </Typography>
        {isLoading && <CircularProgress />}
        {error && <Alert>{JSON.stringify(error)}</Alert>}
        <Box>
          <TextField
            placeholder="Search..."
            variant="filled"
            fullWidth
            value={searchText}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <DataTable
          loading={isLoading}
          data={data}
          paging={paging}
          onPaging={newValues => setPaging(newValues as PagingProps)}
          onEdit={onEdit}
        />
        {/* <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        - enable editing?
        - export?
        - search on bottom?
        - too cool to not use 
      </AppBar> */}
      </>
    </Box>
  )
}
