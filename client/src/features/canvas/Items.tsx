import { Delete } from '@mui/icons-material'
import {
  Button,
  Container,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Paper,
} from '@mui/material'
import { Drawing } from '@root/lib'
import React from 'react'
import { useCallback } from 'react'
import config from '../../shared/config'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { actions } from './slice'
import { deleteAsync, itemsAsync } from './thunks'

export default function Items() {
  const items = useAppSelector((store) => store.canvas.items)
  const activeId = useAppSelector((store) => store.canvas.active?.id)
  const dispatch = useAppDispatch()
  const setItem = useCallback(
    (item: Drawing) => dispatch(actions.patchActive(item)),
    [dispatch]
  )
  const isActive = (item: Drawing) => activeId === item?.id

  const deleteItem = async (item: Drawing) => {
    const result = await dispatch(deleteAsync(item.id as string))
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('deleted')
    }
  }

  React.useEffect(() => {
    dispatch(itemsAsync())
  }, [dispatch])

  return (
    <Container maxWidth="xl">
      <Paper variant="elevation" sx={{ padding: '1rem' }}>
        <ImageList>
          {items.map((item) => (
            <ImageListItem
              key={item.id}
              sx={{
                border: `solid 1px ${
                  isActive(item) ? '#eafe34' : 'transparent'
                }`,
              }}
            >
              <img
                src={item.thumbnail}
                alt={item.name}
                loading="lazy"
                style={{
                  backgroundColor: 'rgba(200, 163, 255, .1)',
                  height: config.thumbnails.height,
                  width: config.thumbnails.width,
                }}
                width={config.thumbnails.width}
                height={config.thumbnails.height}
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
      </Paper>
    </Container>
  )
}
