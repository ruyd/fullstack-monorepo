/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Box, Dialog, DialogTitle, Switch, TextField, Typography } from '@mui/material'
import { Drawing } from '../../../../lib/src/types'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { actions } from './slice'

export function Details() {
  const dispatch = useAppDispatch()
  const show = useAppSelector(state => state.canvas.showDetails)
  const item = useAppSelector(state => state.canvas.active)
  const close = React.useCallback(() => {
    dispatch(actions.patch({ showDetails: false }))
  }, [dispatch])

  return (
    <Dialog open={!!show} onClose={close}>
      <Box>
        <Typography>Properties {item?.name}</Typography>
        <TextField placeholder="Price" />
        <Switch value={item?.sell} /> Sell
        <Switch value={item?.private} /> Private
      </Box>
    </Dialog>
  )
}

export default Details
