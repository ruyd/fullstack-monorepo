/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from '@mui/material/Box'
import { useAppDispatch } from '../../shared/store'
import React from 'react'
import { request, useGet, notify } from '../app'
import _ from 'lodash'

import { useSearchParams } from 'react-router-dom'
import { PagedResult, GridPatchProps } from '@lib'
import SearchIcon from '@mui/icons-material/Search'
import { Method } from '../app/thunks'
import Spacer from '../ui/Spacer'
import AlertDialog, { ShowDialogProps } from '../ui/AlertDialog'
import Container from '@mui/system/Container'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { debounce } from '@mui/material/utils'

export interface PagingProps {
  page: number
  limit: number
}

export default function Items() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const [searchText, setSearchText] = React.useState('')
  const model = searchParams.get('model') || ''
  const [paging, setPaging] = React.useState<PagingProps>({ limit: 100, page: 0 })
  const [alert, setAlert] = React.useState<ShowDialogProps>({
    open: false
  })
  const { data, isLoading, error, refetch } = useGet<PagedResult>(
    model,
    `${model}`,
    {
      enabled: !!model
    },
    {
      ...paging,
      search: searchText
    }
  )
  const refresh = React.useMemo(() => debounce(refetch, 500), [refetch])
  const modelPlural = !model ? '' : _.capitalize(model) + (model?.endsWith('s') ? '' : 's')

  const onEdit = async (params: GridPatchProps) => {
    const response = await request(`${model}`, params, Method.PATCH)
    if (response) {
      dispatch(notify('Updated'))
    }
  }

  const handleSearch: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = e => {
    setSearchText(e.target.value)
    refresh()
  }

  const handlePaging = (newValues: Partial<PagingProps>) => {
    setPaging(newValues as PagingProps)
    refresh()
  }

  return (
    <Container sx={{ mt: 5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ margin: '1rem 1rem 0 0' }}>
          Titles
        </Typography>
        <Spacer />
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
            endAdornment: <InputAdornment position="end">({data?.total || 0})</InputAdornment>
          }}
        />
      </Box>
      <>{error && <Alert>{JSON.stringify(error)}</Alert>}</>
      <Paper variant="outlined" sx={{ p: 2, mt: 2, flexGrow: 1, borderRadius: '12px' }}>
        {data?.items?.map((item, index) => (
          <Card key={index} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {item.description}
            </Typography>
          </Card>
        ))}
      </Paper>
      <AlertDialog
        open={alert.open}
        message={alert.message}
        title={alert.title}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
      />
    </Container>
  )
}
