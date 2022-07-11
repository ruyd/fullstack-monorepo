import React from 'react'
import { DrawAction } from '@root/lib'
import { useAppSelector } from '../../shared/store'
import StyledSlider from './StyledSlider'
import Box from '@mui/material/Box'

export default function Player({
  buffer,
}: {
  buffer: React.RefObject<DrawAction[]>
}) {
  const active = useAppSelector((state) => state.canvas?.active)

  return (
    <Box sx={{ width: '90%', margin: '0 auto' }}>
      <StyledSlider
        valueLabelDisplay="on"
        max={buffer?.current?.length}
        color="secondary"
        marks={[
          { value: 0, label: '0' },
          {
            value: buffer?.current?.length as number,
            label: `${buffer?.current?.length}`,
          },
        ]}
      />
    </Box>
  )
}
