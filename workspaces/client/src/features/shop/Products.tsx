import { PagedResult, Product } from '@lib'
import { Box } from '@mui/material'
import { useGet } from '../app'

export default function Products(): JSX.Element {
  const { data: products, isLoading: isLoadingProducts } = useGet<PagedResult<Product>>(
    'product',
    'product',
  )

  return (
    <Box mt={5}>
      <h1>Products</h1>
      {isLoadingProducts && <div>Loading...</div>}
      {products?.items?.map((product: Product) => (
        <div key={product.productId}>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <p>{product.prices?.at(0)?.amount}</p>
        </div>
      ))}
    </Box>
  )
}
