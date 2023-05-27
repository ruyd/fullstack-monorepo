import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid'
import { PagedResult, Subscription, SubscriptionPlan } from '@lib'
import React from 'react'
import { useGet } from '../../app'
import AlertDialog, { ShowDialogProps } from '../../ui/AlertDialog'
import { PagingProps } from '../Data'
import { Delete, Edit, Search as SearchIcon } from '@mui/icons-material'
import PlanEdit from './PlanEdit'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import { debounce } from '@mui/material/utils'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AccordionDetails from '@mui/material/AccordionDetails'
import IconButton from '@mui/material/IconButton'
import AccordionActions from '@mui/material/AccordionActions'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import ButtonGroup from '@mui/material/ButtonGroup'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

export default function Subscriptions() {
  const [tab, setTab] = React.useState('all')
  const [searchText, setSearchText] = React.useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedItems, setSelectedItems] = React.useState<(string | number)[]>([])
  const [paging] = React.useState<PagingProps>({ limit: 100, page: 0 })
  const [alert] = React.useState<ShowDialogProps>({
    open: false
  })
  const [showPlan, setShowPlan] = React.useState<ShowDialogProps>({
    open: false
  })
  // const [showSubscription, setShowSubscription] = React.useState<ShowDialogProps>({
  //   open: false
  // })
  const { data, isLoading, error, refetch } = useGet<PagedResult<Subscription>>(
    'subscriptions',
    `subscription`,
    {},
    {
      ...paging,
      search: searchText
    }
  )

  const { data: plans } = useGet<PagedResult<SubscriptionPlan>>('plans', `subscriptionplan`)
  const refresh = React.useMemo(() => debounce(refetch, 500), [refetch])

  const filters = ['all', 'active', 'expired', 'cancelled']

  const columns: GridColDef[] = [
    {
      field: 'user.email',
      headerName: 'name',
      editable: true
    },
    {
      field: 'description',
      headerName: 'Description',
      editable: true
    },
    {
      field: 'amount',
      headerName: 'Price'
    },
    {
      field: 'interval',
      headerName: 'Interval'
    },
    {
      field: 'intervalCount',
      headerName: 'Count'
    },
    {
      field: 'enabled',
      headerName: 'enabled'
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

  // const handleViewDetails = () => {
  //   const first = data?.items?.find(i => i.userId === selectedItems[0])
  //   setShowPlan({
  //     open: true,
  //     title: 'User Details',
  //     payload: first
  //   })
  // }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <>
        <Accordion>
          <AccordionSummary>
            <Typography>Plans</Typography>
            <Button onClick={() => setShowPlan({ open: true })}>Add</Button>
          </AccordionSummary>
          <AccordionDetails>
            {plans?.items?.map(p => (
              <Box key={p.subscriptionPlanId} sx={{ margin: '.5rem' }}>
                <Typography>{p.name}</Typography>
                <Typography>{p.description}</Typography>
                <Typography>{p.amount}</Typography>
                <Typography>{p.interval}</Typography>
                <IconButton>
                  <Edit />
                </IconButton>
                <IconButton>
                  <Delete />
                </IconButton>
              </Box>
            ))}
          </AccordionDetails>
          <AccordionActions></AccordionActions>
        </Accordion>

        <Typography>Subscriptions</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '.2rem 0' }}>
          <ToggleButtonGroup
            exclusive
            color="primary"
            value={tab}
            onChange={(e, v) => setTab(v)}
            defaultChecked={true}
          >
            {filters.map(f => (
              <ToggleButton key={f} value={f} aria-label={f}>
                {f}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <ButtonGroup size="small">
            <Button color="warning">Cancel</Button>
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
          open={showPlan.open}
          onClose={() => setShowPlan({ open: false })}
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
          <PlanEdit
            item={showPlan.payload as SubscriptionPlan}
            setState={(sub: SubscriptionPlan) => setShowPlan(prev => ({ ...prev, payload: sub }))}
          />
        </Dialog>
      </>
    </Box>
  )
}
