/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import Box from '@mui/material/Box'
import config from 'src/shared/config'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { loadDataAsync, useGet } from './thunks'
import React from 'react'
import _ from 'lodash'
import {
  Alert,
  AppBar,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { PagedResult, GridPatchProps } from '@shared/lib'
import DataTable from './DataTable'
import SearchIcon from '@mui/icons-material/Search'

const excluded = ['history']

export interface PagingProps {
  page: number
  limit: number
}

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
  const modelPlural = !model ? '' : _.capitalize(model) + (model?.endsWith('s') ? '' : 's')

  const onEdit = (params: GridPatchProps) => {
    console.log('onEdit patch to server field props, like lean op to end', params)
  }

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
