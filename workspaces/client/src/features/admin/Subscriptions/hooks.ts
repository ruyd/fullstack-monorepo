import axios from 'axios'
import { useQuery } from 'react-query'
import config from 'src/shared/config'

export function useProducts() {
  const stripeProducts = useQuery(
    'stripe.products',
    async () => {
      await axios.get('https://api.stripe.com/v1/products', {
        auth: {
          username: config.settings.system?.paymentMethods?.stripe?.publishableKey || '',
          password: '',
        },
      })
    },
    {
      enabled: false,
    },
  )
  // eslint-disable-next-line no-console
  console.log(stripeProducts)
  return stripeProducts
}
