import { Slider } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { actions } from './slice'

export default function LineSize() {
  const activeSize = useAppSelector((state) => state.canvas.size)
  const dispatch = useAppDispatch()
  const onSize = (e: Event, v: number | number[]) =>
    dispatch(actions.patch({ size: v as number }))
  return <Slider value={activeSize || 5} onChange={onSize} min={1} max={100} />
}
