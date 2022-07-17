import { Backspace } from '@mui/icons-material'
import { Box, Fab, Stack } from '@mui/material'

const colors = ['red', 'blue', 'green', 'yellow', 'black']

export default function Color() {
  return (
    <Box style={{ position: 'absolute', top: '30%', right: '5%' }}>
      <Stack spacing={1}>
        {colors.map((c) => (
          <Fab key={c} sx={{ backgroundColor: c }} />
        ))}

        <Fab>
          <Backspace />
        </Fab>
      </Stack>
    </Box>
  )
}
