import { Delete } from '@mui/icons-material'
import {
  Button,
  Card,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
} from '@mui/material'
import { Drawing } from '@root/lib'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { actions } from './slice'
import { deleteAsync } from './thunks'

export default function Items() {
  const items = useAppSelector((store) => store.canvas.items)
  const dispatch = useAppDispatch()
  const setItem = useCallback(
    (item: Drawing) => dispatch(actions.patch({ active: item })),
    [dispatch]
  )

  const deleteItem = async (item: Drawing) => {
    const result = await dispatch(deleteAsync(item.id as string))
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('deleted')
    }
  }

  console.log(items)

  return (
    <ImageList>
      {items.map((item) => (
        <ImageListItem key={item.id}>
          <img
            src={item.thumbnail}
            alt={item.name}
            loading="lazy"
            style={{
              height: '150px',
              width: '300px',
              backgroundColor: 'rgba(200, 163, 255, .1)',
            }}
          />
          <ImageListItemBar
            title={item.name}
            actionIcon={
              <>
                <Button onClick={() => setItem(item)}>Edit</Button>
                <IconButton onClick={() => deleteItem(item)}>
                  <Delete />
                </IconButton>
              </>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  )
}
