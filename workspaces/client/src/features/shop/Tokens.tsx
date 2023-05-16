import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material'
import { useGet } from '../app/thunks'
import { PagedResult, Product } from '@lib'
import { useAppDispatch } from 'src/shared/store'
import { cartAsync } from './thunks'
import React from 'react'

export default function Tokens(): JSX.Element {
  const dispatch = useAppDispatch()
  const { data, isLoading: isLoadingProducts } = useGet<PagedResult<Product>>(
    'tokens',
    'product',
    undefined,
    {
      title: 'Tokens%'
    }
  )
  const [selectedIndex, setSelectedIndex] = React.useState(200)
  const format = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format
  const formatted = (value?: number) => (value ? format(value / 100) : '')
  const addToCartHandler = () => {
    const product = data?.items.find(product =>
      product.prices?.find(p => p.divide_by === selectedIndex)
    )
    const price = product?.prices?.find(price => price.divide_by === selectedIndex)
    dispatch(cartAsync({ product: { ...product, ...price }, quantity: 1, cartType: 'tokens' }))
  }

  return (
    <Container maxWidth="sm">
      <Card sx={{ m: 5, textAlign: 'center' }}>
        <CardHeader title="Tokens" subheader="Purchasing Options" />
        <CardContent sx={{ justifyContent: 'center', display: 'flex' }}>
          {data?.items.map(product => (
            <RadioGroup
              key={product.productId}
              defaultValue={product.prices?.[0].divide_by}
              value={selectedIndex}
              onChange={event => setSelectedIndex(parseInt(event.target.value))}
            >
              {product.prices &&
                product.prices.map(price => (
                  <FormControlLabel
                    key={price.id}
                    value={price.divide_by}
                    control={<Radio />}
                    label={`${price.divide_by} tokens for ${formatted(price.amount)}`}
                  />
                ))}
            </RadioGroup>
          ))}
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" fullWidth onClick={addToCartHandler}>
            Add to Cart
          </Button>
        </CardActions>
      </Card>
    </Container>
  )
}
