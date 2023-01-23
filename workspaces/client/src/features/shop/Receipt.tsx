import { Box, BoxProps, Card, CardContent, Typography } from '@mui/material'

export default function Receipt(props: BoxProps & Partial<React.Component>) {
  return (
    <Box {...props}>
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
        </CardContent>
      </Card>
    </Box>
  )
}
