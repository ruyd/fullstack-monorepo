import { PagedResult, Product } from '@lib'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItemButton
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useAppSelector } from 'src/shared/store'
import { useGet } from '../app'

// write a component to manage active subscriptions (change and cancell)
export default function Subscription(): JSX.Element {
  const activeSubscription = useAppSelector(state => state.shop.activeSubscription)
  const subscriptions = useAppSelector(state => state.shop.subscriptions)
  const { data: others, isLoading: isLoadingOthers } = useGet<PagedResult<Product>>(
    'products.subscription',
    'product',
    undefined,
    {
      title: '!Tokens%'
    }
  )
  return (
    <Container>
      <Card>
        <CardHeader
          title={`Active Subscription: ${activeSubscription?.title}`}
          action={
            <CardActions>
              <Button>Cancel</Button>
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
            <Grid item xs={12}>
              <Accordion sx={{ m: 1 }}>
                <AccordionSummary>
                  Change Subscription {isLoadingOthers && <CircularProgress />}
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {others?.items?.map(product => (
                      <ListItemButton key={product.productId}>
                        <Grid container>
                          <Grid item xs={5}>
                            {product.title}
                          </Grid>
                          <Grid item xs={5}>
                            {product.prices?.[0].amount}
                          </Grid>
                          <Grid item xs={2}>
                            <Button>Select</Button>
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
                headerName: 'Created At',
                width: 200
              },
              {
                field: 'canceledAt',
                headerName: 'Canceled At',
                width: 200
              },
              {
                field: 'cancelationReason',
                headerName: 'Cancelation Reason',
                width: 200
              }
            ]}
          />
        </CardContent>
      </Card>
    </Container>
  )
}
