/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Order, PagedResult } from '@shared/lib'
import { useGet } from 'src/features/app'

export function UserOrders() {
  const { data, isLoading, error } = useGet<PagedResult<Order>>(
    'orders',
    `user/orders`,
    {},
    { limit: 100, page: 0 },
  )
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 150,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 150,
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 150,
    },
  ]
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data?.items || []}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  )
}

export default UserOrders
