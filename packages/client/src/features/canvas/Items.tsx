import { Card, Stack } from '@mui/material'
import { Drawing } from '@root/lib'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { actions } from './slice'

export default function Items() {
  const items = useAppSelector((store) => store.canvas.items)
  const dispatch = useAppDispatch()
  const setItem = useCallback(
    (item: Drawing) => dispatch(actions.patch({ current: item })),
    [dispatch]
  )
  return (
    <Stack>
      {items.map((item) => (
        <Card onClick={() => setItem(item)}>{item.name}</Card>
      ))}
    </Stack>
  )
}
