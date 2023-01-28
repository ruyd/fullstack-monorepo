/* eslint-disable @typescript-eslint/no-unused-vars */
import { MonetizationOn, AttachMoney, Settings } from '@mui/icons-material'
import { Stack, Fab, Box } from '@mui/material'
import { useAppDispatch } from '../../shared/store'
import Color from './Color'
import LineSize from './LineSize'
import { actions } from './slice'

export function Toolbar({
  newHandler,
  clearHandler,
  saveHandler,
}: {
  newHandler: () => void
  clearHandler: () => void
  saveHandler: () => void
}) {
  const dispatch = useAppDispatch()
  const showDetails = () => dispatch(actions.patch({ showDetails: true }))
  return (
    <>
      <Box sx={{ position: 'absolute', top: '12%', right: '3%' }}>
        <Fab sx={{ mb: 2 }} onClick={showDetails}>
          <Settings color="primary" fontSize="large" />
        </Fab>
        <Color />
        <Stack spacing={1} mt="1rem">
          <Fab color="secondary" onClick={newHandler}>
            New
          </Fab>
          <Fab color="secondary" onClick={clearHandler}>
            Clear
          </Fab>
          <Fab color="secondary" onClick={saveHandler}>
            Save
          </Fab>
        </Stack>
      </Box>
      <LineSize />
    </>
  )
}

export default Toolbar
