/* eslint-disable @typescript-eslint/no-unused-vars */
import { type PagedResult, type Price, type Product } from '@lib'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  GlobalStyles,
  Grid,
  Link,
  Typography
} from '@mui/material'
import { useGet } from '../app'
import { patch } from './slice'
import StarIcon from '@mui/icons-material/StarBorder'
import { useAppDispatch } from 'src/shared/store'
import { cartAsync } from './thunks'

type ProductWithPrice = Product & Price

export default function Products({
  onSelect
}: {
  onSelect?: (item: ProductWithPrice) => void
}): JSX.Element {
  const dispatch = useAppDispatch()
  const { data, isLoading: isLoadingProducts } = useGet<PagedResult<Product>>('product', 'product')
  const products = data?.items
    ?.filter(p => p.prices?.some(a => !(a.interval?.length === 0)))
    .reduce((acc: ProductWithPrice[], product: Product) => {
      if (product.prices == null) {
        return acc
      }
      const prices = product.prices.map(price => ({
        ...product,
        ...{ ...price, amount: price.amount / 100 }
      }))

      return [...acc, ...prices]
    }, [])

  const intervalText = (item: ProductWithPrice) => {
    switch (item.interval) {
      case 'month':
        if (item.intervalCount && item.intervalCount > 1) {
          return `every ${item.intervalCount} months`
        }
        return 'per month'
      case 'year':
        return 'per year'
      default:
        return ''
    }
  }

  const onSelectProduct = (item: ProductWithPrice) => {
    dispatch(cartAsync({ product: item, quantity: 1 }))
    dispatch(patch({ activeStep: 1 }))
    onSelect?.(item)
  }

  return (
    <>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <Container maxWidth="md">
        <Grid container spacing={5} alignItems="flex-end">
          {products?.map(tier => (
            <Grid item key={tier.id} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.description}
                  titleTypographyProps={{ align: 'center' }}
                  action={tier.title === 'Pro' ? <StarIcon /> : null}
                  subheaderTypographyProps={{
                    align: 'center'
                  }}
                  sx={{
                    backgroundColor: theme =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700]
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2
                    }}
                  >
                    <Typography component="h2" variant="h3" color="text.primary">
                      ${tier.amount}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /{intervalText(tier)}
                    </Typography>
                  </Box>
                  <ul>
                    {tier.description?.split(' ').map((line: string) => (
                      <Typography component="li" variant="subtitle1" align="center" key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      onSelectProduct(tier)
                    }}
                  >
                    Select
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}
