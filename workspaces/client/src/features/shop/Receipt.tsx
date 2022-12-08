import { Box, BoxProps, Typography } from '@mui/material'

export default function Receipt(props: BoxProps & Partial<React.Component>) {
  return (
    <Box {...props}>
      <Typography>Receipt</Typography>
      <Typography>Thank you for your order.</Typography>
    </Box>
  )
}
