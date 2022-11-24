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
import ReactDataGrid from '@inovua/reactdatagrid-community'

interface Column {
  id: string
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const slice = (s: string | number, max = 100) => {
  if (typeof s === 'string' && s.length > max) {
    return s.slice(0, max) + '...'
  }
  return s
}

export default function DataTable({ data }: { data?: PagedResult }) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const first = React.useMemo(
    () => data?.items?.[0] || ({} as Record<string, unknown>),
    [data?.items],
  )
  const columns: Column[] = Object.keys(first)
    .filter(key => typeof first[key] !== 'object')
    .map(key => ({
      id: key,
      label: key,
      minWidth: 170,
    }))

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  // const Head = ({ columns }: { columns: Column[] }) =>
  //   React.useMemo(
  //     () => (
  //       <TableHead>
  //         <TableRow>
  //           {columns.map(column => (
  //             <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
  //               {column.label}
  //             </TableCell>
  //           ))}
  //         </TableRow>
  //       </TableHead>
  //     ),
  //     [columns],
  //   )

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <ReactDataGrid idProperty="id" columns={columns} dataSource={data?.items || []} />
    </Paper>
  )
}
