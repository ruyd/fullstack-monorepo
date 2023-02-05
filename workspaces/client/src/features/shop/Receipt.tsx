import { Box, Stack, Typography } from '@mui/material'
import { useAppSelector } from 'src/shared/store'

export default function Receipt() {
  const order = useAppSelector(state => state.shop.receipt)
  return (
    <Stack sx={{ flex: 1, textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" component="h1">
        Thank you
      </Typography>
      <Box sx={{ height: '200px', margin: '20px 0' }}>
        <div className="success-checkmark">
          <div className="check-icon">
            <span className="icon-line line-tip"></span>
            <span className="icon-line line-long"></span>
            <div className="icon-circle"></div>
            <div className="icon-fix"></div>
          </div>
        </div>
        <Typography variant="h5">Your order was placed succesfully!</Typography>
        {order?.orderId}
      </Box>
    </Stack>
  )
}
