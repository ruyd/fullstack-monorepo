import React from 'react'
import { Backspace, Check } from '@mui/icons-material'
import { Box, BoxProps, Fab, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { actions } from './slice'

const colors = ['yellow', 'red', 'blue', 'green', 'black']

export default function Color(props: BoxProps) {
  const dispatch = useAppDispatch()
  const activeColor = useAppSelector((state) => state.canvas.color)
  const [prev, setPrev] = React.useState<string | undefined>()
  const isActive = (c: string) => activeColor === c
  const setColor = (requested: string) => {
    const color =
      requested === 'transparent' && activeColor === 'transparent'
        ? prev
        : requested
    dispatch(actions.patch({ color }))
    setPrev(activeColor)
  }

  return (
    <Box {...props}>
      <Stack spacing={1}>
        {colors.map((c) => (
          <Fab
            key={c}
            sx={{
              backgroundColor: c,
            }}
            onClick={() => setColor(c)}
          >
            {isActive(c) && <Check />}
          </Fab>
        ))}

        <Fab title="eraser" onClick={() => setColor('transparent')}>
          <Backspace
            sx={{
              transform: isActive('transparent')
                ? 'rotate(-45deg)'
                : 'rotate(-90deg)',
              transition: 'all 200ms ease-in',
            }}
          />
        </Fab>
      </Stack>
    </Box>
  )
}
