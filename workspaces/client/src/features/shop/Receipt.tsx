import { Box, Card, CardContent, Typography } from '@mui/material'
import { useAppSelector } from 'src/shared/store'

export default function Receipt() {
  const order = useAppSelector(state => state.shop.receipt)
  return (
    <Box sx={{ flex: 1 }}>
      <Typography>Thank you</Typography>
      <Card>
        <CardContent sx={{ height: '200px', margin: '20px 0' }}>
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
          <p className="mx-5">Your order was placed succesfully!</p>
          {order?.orderId}
        </CardContent>
      </Card>
    </Box>
  )
}
