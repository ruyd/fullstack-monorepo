import { Button, Card, Stack } from '@mui/material'
import { Drawing } from '@root/lib'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { actions } from './slice'

export default function Items() {
  const items = useAppSelector((store) => store.canvas.items)
  const dispatch = useAppDispatch()
  const setItem = useCallback(
    (item: Drawing) => dispatch(actions.patch({ active: item })),
    [dispatch]
  )
  return (
    <Stack direction="row">
      {items.map((item) => (
        <Button
          variant="contained"
          key={item.id}
          onClick={() => setItem(item)}
          sx={{ padding: '2rem' }}
        >
          {item.name}
        </Button>
      ))}
    </Stack>
  )
}
