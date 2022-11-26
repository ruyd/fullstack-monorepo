/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Paper from '@mui/material/Paper'
import _ from 'lodash'
import { Box, useTheme } from '@mui/material'
import { GridPatchProps, PagedResult } from '@shared/lib'
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid'
import { PagingProps } from './Data'

const excluded = ['history']

export default function DataTable(
  {
    loading,
    data,
    paging,
    onPaging,
    onEdit,
  }: {
    loading?: boolean
    data?: PagedResult
    paging: PagingProps
    onPaging?: (newValues: Partial<PagingProps>) => void
    onEdit?: (params: GridPatchProps) => void
  } = { paging: { limit: 100, page: 1 } },
) {
  const theme = useTheme()
  const rows = data?.items.map(o => _.omit(o, excluded)) || []
  const columns: GridColDef[] = Object.keys(data?.items[0] || {}).map(key => ({
    field: key,
    headerName: key,
    width: 170,
    editable: true,
  }))

  const handleChangePage = (newPage: number, details: unknown): void => {
    console.log('handleChangePage', newPage)
    if (onPaging) {
      onPaging({
        page: newPage,
      })
    }
  }

  const handleChangeRowsPerPage = (pageSize: number) => {
    console.log('handleChangeRowsPerPage', pageSize)
    if (onPaging) {
      onPaging({
        limit: pageSize,
      })
    }
  }

  const handleEdit: GridEventListener<'cellEditCommit'> = (params, event) => {
    const value = (event as { target: { value: unknown } }).target.value
    const { id, field } = params
    console.log('handleEdit', id, field, value)
    if (onEdit) {
      onEdit({ id, field, value })
    }
  }

  const handleOther: GridEventListener<'cellEditCommit'> = (params, event) => {
    console.log('handleOther', params, event)
  }

  return (
    <Paper
      sx={{
        flexGrow: 1,
        overflow: 'hidden',
      }}
    >
      <DataGrid
        sx={{
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.background.paper,
          },
        }}
        rows={rows}
        columns={columns}
        pageSize={paging.limit}
        page={paging.page}
        rowsPerPageOptions={[5]}
        checkboxSelection
        loading={loading}
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={row => row[Object.keys(row)[0]]}
        onCellEditStop={handleEdit}
        // hideFooterPagination
        // hideFooter
        onPageChange={handleChangePage}
        onPageSizeChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
