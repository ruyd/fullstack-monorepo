/* eslint-disable @typescript-eslint/no-unused-vars */
import { Delete, Edit, Settings as SettingsIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  ContainerProps,
  Grid,
  IconButton,
  ImageList,
  Paper,
  Typography,
} from '@mui/material'
import { Drawing } from '@shared/lib'
import React from 'react'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Paths } from 'src/shared/routes'
import { config } from '../../shared/config'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { actions } from './slice'
import { deleteAsync, itemsAsync } from './thunks'

export default function Items(props: ContainerProps) {
  const token = useAppSelector(state => state.app.token)
  const items = useAppSelector(store => store.canvas.items)
  const loaded = useAppSelector(store => store.canvas.loaded)
  const activeId = useAppSelector(store => store.canvas.active?.id)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const setItem = useCallback((item: Drawing) => dispatch(actions.patchActive(item)), [dispatch])
  const isActive = (item: Drawing) => activeId === item?.id
  const { id } = useParams()

  const deleteItem = async (item: Drawing) => {
    const result = await dispatch(deleteAsync(item.id as string))
    if (result.meta.requestStatus === 'fulfilled') {
      if (id === item.id) {
        navigate(Paths.Draw, { replace: true })
      }
    }
  }

  React.useEffect(() => {
    if (!loaded && token) {
      dispatch(itemsAsync())
    }
  }, [dispatch, loaded, token])

  if (!items.length) {
    return null
  }

  return (
    <Container maxWidth="xl" {...props}>
      <ImageList>
        {items.map(item => (
          <Paper
            title={item.name}
            key={item.id}
            sx={{
              backgroundColor: 'primary.main',
              borderRadius: '16px',
              transition: 'all 200ms ease-in',
              marginRight: '0.5rem',
              display: 'flex',
              position: 'relative',
              maxWidth: '47vw',
            }}
          >
            <img
              src={item.thumbnail}
              alt={item.name}
              loading="lazy"
              style={{
                height: config.thumbnails.height,
                width: config.thumbnails.width,
                borderRadius: '16px',
              }}
              width={config.thumbnails.width}
              height={config.thumbnails.height}
            />
            <Paper
              sx={{
                opacity: 0.5,
                height: '40%',
                bottom: 0,
                left: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
              }}
            >
              <Grid
                container
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '0 1rem',
                }}
              >
                <Grid item>
                  <Typography
                    sx={
                      {
                        // fontFamily: '"Public Sans", sans-serif',
                      }
                    }
                  >
                    {item.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => setItem(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => setItem(item)}>
                    <SettingsIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteItem(item)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          </Paper>
        ))}
      </ImageList>
    </Container>
  )
}
