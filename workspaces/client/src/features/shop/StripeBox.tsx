import { Box } from '@mui/material'
import React from 'react'
import StripeCheckout from './Checkout'

export default function StripeBox({
  children,
  modalState,
  show = true,
  approveCallback = undefined,
  onLoading = undefined,
}: React.PropsWithChildren<{
  modalState: () => void
  show?: boolean
  approveCallback?: () => void
  onLoading?: () => void
}>): JSX.Element {
  return (
    <Box sx={{ position: 'relative' }}>
      <div>{children}</div>
      {show && (
        <div
          style={{
            backgroundColor: 'white',
            inset: 0,
            position: 'absolute',
          }}
        >
          <StripeCheckout
            modalState={modalState}
            approveCallback={approveCallback}
            onLoading={onLoading}
          />
        </div>
      )}
    </Box>
  )
}
