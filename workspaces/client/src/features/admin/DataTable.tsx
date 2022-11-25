/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { PagedResult } from '../../../../lib/src/types'
import { v4 as uuid } from 'uuid'
import _ from 'lodash'
import { Box, useTheme } from '@mui/material'
import { PagingProps } from './Data'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { TextFieldsRounded } from '@mui/icons-material'

// interface Column {
//   id: string | number
//   label: string
//   minWidth?: number
//   align?: 'right'
//   format?: (value: number) => string
// }

const excluded = ['history']

/**
 * Search, filtering and disconnected pager
 * see totals and page numbers, navigation
 */
export default function DataTable(
  {
    data,
    paging,
    onPaging,
  }: {
    data?: PagedResult
    paging: PagingProps
    onPaging?: (newValues: Partial<PagingProps>) => void
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

  return (
    <Paper
      sx={{
        flexGrow: 1,
        overflow: 'hidden',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={row => row[Object.keys(row)[0]]}
        hideFooterPagination
        hideFooter
        onPageChange={handleChangePage}
        onPageSizeChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
