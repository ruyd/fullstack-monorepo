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
import { useTheme } from '@mui/material'

interface Column {
  id: string | number
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const excluded = ['history']

/**
 * Search, filtering and disconnected pager
 * see totals and page numbers, navigation
 */
export default function DataTable({ data }: { data?: PagedResult }) {
  const theme = useTheme()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const cleaned = data?.items.map(o => _.omit(o, excluded))

  const columns: Column[] = Object.keys(data?.items[0] || {}).map(key => ({
    id: key,
    label: key,
    minWidth: 170,
  }))

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value))
    setPage(0)
  }

  return (
    <Paper
      sx={{
        height: '100%',
        overflow: 'hidden',
        maxWidth: '92.5vw',
        [theme.breakpoints.down('xl')]: {
          maxWidth: '88vw',
        },
        [theme.breakpoints.down('lg')]: {
          maxWidth: '84vw',
        },
        [theme.breakpoints.down('md')]: {
          maxWidth: '80vw',
        },
        [theme.breakpoints.down('sm')]: {
          maxWidth: '78vw',
        },
      }}
    >
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <caption></caption>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id as string}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {cleaned?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={uuid()}>
                  {columns.map((column: Column) => {
                    const value = row[column.id as number]
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : typeof value === 'object'
                          ? JSON.stringify(value)
                          : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data?.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
