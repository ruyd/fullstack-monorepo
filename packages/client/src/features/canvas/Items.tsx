import { Delete } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Paper,
  Stack,
} from '@mui/material'
import { Drawing } from '@root/lib'
import React from 'react'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { actions } from './slice'
import { deleteAsync, loadAsync } from './thunks'

export default function Items() {
  const items = useAppSelector((store) => store.canvas.items)
  const dispatch = useAppDispatch()
  const setItem = useCallback(
    (item: Drawing) => dispatch(actions.patchActive(item)),
    [dispatch]
  )

  const deleteItem = async (item: Drawing) => {
    const result = await dispatch(deleteAsync(item.id as string))
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('deleted')
    }
  }

  React.useEffect(() => {
    dispatch(loadAsync())
  }, [dispatch])

  return (
    <Container maxWidth="xl">
      <Paper variant="outlined" sx={{ padding: '1rem' }}>
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
      </Paper>
    </Container>
  )
}
