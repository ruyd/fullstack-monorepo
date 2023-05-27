import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid'
import { PagedResult, User } from '@lib'
import React from 'react'
import { useGet } from '../../app'
import AlertDialog, { ShowDialogProps } from '../../ui/AlertDialog'
import { PagingProps } from '../Data'
import SearchIcon from '@mui/icons-material/Search'
import UserDetail from './Detail'
import { debounce } from '@mui/material/utils'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

/**
 *
 * Users needs special view, we want to see online status as well as certain actions
 * maybe we can enrich generic editor via props, think
 * - Auth0 Roles, Password stuff
 */
export default function Users() {
  const [tab, setTab] = React.useState('all')
  const [searchText, setSearchText] = React.useState('')
  const [selectedItems, setSelectedItems] = React.useState<(string | number)[]>([])
  const [paging] = React.useState<PagingProps>({ limit: 100, page: 0 })
  const [alert] = React.useState<ShowDialogProps>({
    open: false
  })
  const [showDetails, setShowDetails] = React.useState<ShowDialogProps>({
    open: false
  })
  const { data, isLoading, error, refetch } = useGet<PagedResult<User>>(
    'users',
    `user`,
    {},
    {
      ...paging,
      search: searchText
    }
  )
  const refresh = React.useMemo(() => debounce(refetch, 500), [refetch])

  const columns: GridColDef[] = [
    {
      field: 'picture',
      headerName: 'Picture',
      renderCell: params => {
        return <img src={params.value} style={{ width: 50, height: 50 }} alt="avatar" />
      }
    },
    {
      field: 'sessions',
      headerName: 'Active'
    },
    {
      field: 'email',
      headerName: 'Email',
      editable: true
    },
    {
      field: 'firstName',
      headerName: 'First Name'
    },
    {
      field: 'lastName',
      headerName: 'Last Name'
    },
    {
      field: 'banned',
      headerName: 'Banned'
    },
    {
      field: 'logins',
      headerName: 'Logins'
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login'
    }
  ]

  // const handleChangePage = (newPage: number, details: unknown): void => {
  //   console.log('handleChangePage', newPage)
  // }

  // const handleChangeRowsPerPage = (pageSize: number) => {
  //   console.log('handleChangeRowsPerPage', pageSize)
  // }

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
    const first = data?.items?.find(i => i.userId === selectedItems[0])
    setShowDetails({
      open: true,
      title: 'User Details',
      payload: first
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
              )
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
          sx={{
            '& .MuiDialog-paper': {
              width: '100%',
              maxWidth: '100%',
              minHeight: '70%',
              borderRadius: '16px'
            }
          }}
        >
          <UserDetail user={showDetails.payload as unknown as User} />
        </Dialog>
      </>
    </Box>
  )
}
