import React, { useEffect } from 'react'
import { DrawAction } from '@root/lib'
import { useAppSelector } from '../../shared/store'
import StyledSlider from '../../layout/StyledSlider'
import Box from '@mui/material/Box'

export default function Player({
  buffer,
}: {
  buffer: React.RefObject<DrawAction[]>
}) {
  const active = useAppSelector((state) => state.canvas?.active)
  const max = buffer?.current?.length || 1
  const [marks, setMarks] = React.useState<{ value: number; label: string }[]>(
    []
  )

  console.log(active)

  useEffect(() => {
    const m = [{ value: 0, label: '0' }]
    if (max > 0) {
      m.push({ value: max, label: `${max}` })
    }
    setMarks(m)
  }, [max])

  return (
    <Box sx={{ width: '300px', margin: '0 auto' }}>
      <StyledSlider max={buffer?.current?.length} marks={marks} />
    </Box>
  )
}
