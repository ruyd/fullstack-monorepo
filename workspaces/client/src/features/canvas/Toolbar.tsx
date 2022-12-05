import { Stack, Fab, Box } from '@mui/material'
import Color from './Color'
import LineSize from './LineSize'

export function Toolbar({
  newHandler,
  clearHandler,
  saveHandler,
}: {
  newHandler: () => void
  clearHandler: () => void
  saveHandler: () => void
}) {
  return (
    <>
      <Box sx={{ position: 'absolute', top: '30%', right: '3%' }}>
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
