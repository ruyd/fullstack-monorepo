import { PagedResult, Price, Product } from '@lib'

import { DataGrid } from '@mui/x-data-grid'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch, useGet } from '../app'
import { patch as patchShop } from '../shop/slice'
import AlertDialog, { ShowDialogProps } from '../ui/AlertDialog'
import React from 'react'
import { cancelSubscriptionAsync, subscribeAsync } from '../shop/thunks'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import CircularProgress from '@mui/material/CircularProgress'
import AccordionDetails from '@mui/material/AccordionDetails'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'

export default function Subscription(): JSX.Element {
  const dispatch = useAppDispatch()
  const activeSubscription = useAppSelector(state => state.shop.activeSubscription)
  const subscriptions = useAppSelector(state => state.shop.subscriptions)
  const { data: products, isLoading: isLoadingOthers } = useGet<PagedResult<Product>>(
    'products.subscription',
    'product',
    undefined,
    {
      title: '!Tokens%'
    }
  )

  const others = products?.items
    ?.filter(p => p.prices?.some(a => !(a.interval?.length === 0)))
    .reduce((acc: Partial<Product & Price>[], product: Product) => {
      if (product.prices == null) {
        return acc
      }
      const prices = product.prices.map(price => ({
        ...product,
        ...{ ...price, amount: price.amount / 100 }
      }))

      return [...acc, ...prices]
    }, [])

  const [alert, setAlert] = React.useState<ShowDialogProps>({
    open: false
  })

  const onSelectSubscription = (item: Partial<Product & Price>) => {
    dispatch(subscribeAsync({ product: item, quantity: 1 }))
    dispatch(patchShop({ activeStep: 0 }))
    dispatch(patch({ dialog: 'checkout' }))
  }

  const cancelHandler = () => {
    setAlert({
      open: true,
      title: 'Cancel Subscription',
      message: 'Are you sure you want to cancel your subscription?',
      onConfirm: () => {
        dispatch(cancelSubscriptionAsync())
        setAlert({ open: false })
      },
      onCancel: () => {
        setAlert({ open: false })
      }
    })
  }

  return (
    <Container>
      <Card>
        <CardHeader
          title={`Active Subscription: ${activeSubscription?.title}`}
          action={
            <CardActions>
              {activeSubscription && <Button onClick={cancelHandler}>Cancel</Button>}
            </CardActions>
          }
        />
        <CardContent>
          <Grid container>
            <Grid item xs={6}>
              <div>Price</div>
              <div>Interval</div>
              <div>Renewed</div>
            </Grid>
            <Grid item xs={6}>
              <div>{activeSubscription?.order?.total}</div>
              <div>{activeSubscription?.order?.total}</div>
              <div>{activeSubscription?.order?.createdAt?.toLocaleString()}</div>
            </Grid>
            <Grid item xs={12} sx={{ p: '1rem 0' }}>
              <Accordion sx={{ backgroundColor: 'secondary.dark' }}>
                <AccordionSummary>
                  {activeSubscription ? 'Change Subscription' : 'Subscribe Today'}
                  {isLoadingOthers && <CircularProgress />}
                </AccordionSummary>
                <AccordionDetails>
                  <List dense sx={{ backgroundColor: 'background.default', borderRadius: '10px' }}>
                    {others?.map(product => (
                      <ListItemButton key={product.productId}>
                        <Grid container>
                          <Grid item xs={5}>
                            {product.title}
                          </Grid>
                          <Grid item xs={4}>
                            {product.prices?.[0].amount}
                          </Grid>
                          <Grid item xs={3}>
                            <Button onClick={() => onSelectSubscription(product)}>
                              {activeSubscription ? 'Start Change' : 'Select Subscription'}
                            </Button>
                          </Grid>
                        </Grid>
                      </ListItemButton>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardHeader title="Subscription History" />
        <CardContent>
          <DataGrid
            rows={subscriptions || []}
            sx={{ height: '400px' }}
            getRowId={row => row.subscriptionId as string}
            columns={[
              {
                field: 'title',
                headerName: 'Title',
                width: 200
              },
              {
                field: 'createdAt',
                headerName: 'Created',
                width: 150
              },
              {
                field: 'canceledAt',
                headerName: 'Canceled',
                width: 150
              },
              {
                field: 'cancelationReason',
                headerName: 'Cancelation Reason',
                width: 300
              }
            ]}
          />
        </CardContent>
      </Card>
      <AlertDialog
        open={alert.open}
        message={alert.message}
        title={alert.title}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        alert={alert.alert}
      />
    </Container>
  )
}
