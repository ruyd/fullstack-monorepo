/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid'
import { PagedResult, User } from '@shared/lib'
import React from 'react'
import { useGet } from 'src/features/app'
import AlertDialog, { AlertDialogProps } from 'src/features/ui/AlertDialog'
import { PagingProps } from '../Data'
import _ from 'lodash'
import {
  Edit,
  EditAttributes,
  NotInterested,
  OnlinePrediction,
  Person,
  Search as SearchIcon,
} from '@mui/icons-material'
import UserDetail from './Detail'
import { title } from 'process'

/**
 *
 * Users needs special view, we want to see oneline status as well as certain actions
 * maybe we can enrich generic editor via props, think
 * - Auth0 Roles, Password stuff
 */
export default function Users() {
  const [tab, setTab] = React.useState('all')
  const [searchText, setSearchText] = React.useState('')
  const [selectedItems, setSelectedItems] = React.useState<(string | number)[]>([])
  const [paging, setPaging] = React.useState<PagingProps>({ limit: 100, page: 0 })
  const [alert, setAlert] = React.useState<AlertDialogProps>({
    open: false,
  })
  const [showDetails, setShowDetails] = React.useState<AlertDialogProps>({
    open: false,
  })
  const { data, isLoading, error, refetch } = useGet<PagedResult<User>>(
    'users',
    `user`,
    {},
    {
      ...paging,
      search: searchText,
    },
  )
  const refresh = React.useMemo(() => debounce(refetch, 500), [refetch])

  const columns: GridColDef[] = [
    {
      field: 'picture',
      headerName: 'Picture',
      renderCell: params => {
        return <img src={params.value} style={{ width: 50, height: 50 }} alt="avatar" />
      },
    },
    {
      field: 'sessions',
      headerName: 'Active',
    },
    {
      field: 'email',
      editable: true,
    },
    {
      field: 'firstName',
    },
    {
      field: 'lastName',
    },
    {
      field: 'roles',
    },
    {
      field: 'logins',
    },
    {
      field: 'lastLogin',
    },
  ]

  const handleChangePage = (newPage: number, details: unknown): void => {
    console.log('handleChangePage', newPage)
  }

  const handleChangeRowsPerPage = (pageSize: number) => {
    console.log('handleChangeRowsPerPage', pageSize)
  }

  const handleEdit: GridEventListener<'cellEditCommit'> = (params, event) => {
    const value = (event as { target: { value: unknown } }).target.value
    const { id, field } = params
    console.log('handleEdit', id, field, value)
  }

  const handleSearch: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = e => {
    setSearchText(e.target.value)
    refresh()
  }

  const handleViewDetails = () => {
    const first = data?.items.find(i => i.userId === selectedItems[0])
    setShowDetails({
      open: true,
      title: 'User Details',
      payload: first,
    })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <>
        <Typography>Users</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '.2rem 0' }}>
          <ToggleButtonGroup
            exclusive
            color="primary"
            value={tab}
            onChange={(e, v) => setTab(v)}
            defaultChecked={true}
          >
            <ToggleButton value="all" aria-label="All">
              All
            </ToggleButton>
            <ToggleButton value="active" aria-label="Active">
              Active
            </ToggleButton>
            <ToggleButton value="banned" aria-label="Banned">
              Banned
            </ToggleButton>
          </ToggleButtonGroup>
          <ButtonGroup size="small">
            <Button onClick={handleViewDetails}>Profile</Button>
            <Button>Reset Pass</Button>
            <Button color="error">Delete</Button>
            <Button color="warning">Ban</Button>
            <Button>Manage Roles</Button>
          </ButtonGroup>
        </Box>
        {error && <Alert>{JSON.stringify(error)}</Alert>}
        <Box>
          <TextField
            size="small"
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
        <DataGrid
          sx={{ height: '60vh' }}
          rows={data?.items || []}
          columns={columns}
          pageSize={paging.limit}
          page={paging.page}
          rowsPerPageOptions={[5]}
          checkboxSelection
          loading={isLoading}
          experimentalFeatures={{ newEditingApi: true }}
          getRowId={row => row[Object.keys(row)[0]]}
          onCellEditStop={handleEdit}
          onSelectionModelChange={newSelectionModel => {
            setSelectedItems(newSelectionModel || [])
          }}
        />
        <AlertDialog
          open={alert.open}
          message={alert.message}
          title={alert.title}
          onConfirm={alert.onConfirm}
          onCancel={alert.onCancel}
        />

        <Dialog
          open={showDetails.open}
          onClose={() => setShowDetails({ open: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <UserDetail user={showDetails.payload as unknown as User} />
          </DialogContent>
        </Dialog>
      </>
    </Box>
  )
}
