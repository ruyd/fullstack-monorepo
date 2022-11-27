/* eslint-disable no-console */
import React from 'react'
import { Delete, Edit, Settings as SettingsIcon } from '@mui/icons-material'
import { Grid, IconButton, Paper, PaperProps, Typography } from '@mui/material'
import { Drawing } from '@shared/lib'
import { config } from '../../shared/config'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { actions } from './slice'
import { deleteAsync } from './thunks'
import Moment from 'react-moment'

export function GalleryCard({ item, ...props }: PaperProps & { item: Drawing }) {
  const userId = useAppSelector(state => state.app.user?.userId)
  const activeId = useAppSelector(store => store.canvas.active?.userId)
  const isOwner = userId === activeId
  const dispatch = useAppDispatch()
  const setItem = React.useCallback(
    (item: Drawing) => {
      if (activeId !== item.id) dispatch(actions.patchActive(item))
    },
    [dispatch, activeId],
  )
  const deleteItem = async (item: Drawing) => {
    const result = await dispatch(deleteAsync(item.id as string))
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('deleted')
    }
  }

  return (
    <Paper
      title={item?.name}
      key={item?.id}
      sx={{
        backgroundColor: 'primary.main',
        borderRadius: '16px',
        transition: 'all 200ms ease-in',
        marginRight: '0.5rem',
        display: 'flex',
        position: 'relative',
        maxWidth: '47vw',
      }}
      {...props}
    >
      <img
        src={item?.thumbnail}
        alt={item?.name}
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
              variant="body1"
              sx={
                {
                  // fontFamily: '"Public Sans", sans-serif',
                }
              }
            >
              {item?.name}
            </Typography>
            <Typography variant="body2">
              <Moment fromNow>{item.createdAt}</Moment>
            </Typography>
          </Grid>
          {isOwner && (
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
          )}
        </Grid>
      </Paper>
    </Paper>
  )
}

export default GalleryCard
