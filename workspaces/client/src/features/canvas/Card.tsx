import React from 'react'
import { Drawing } from '@lib'
import { config } from '../../shared/config'
import Moment from 'react-moment'
import { BlurBackdrop } from '../ui/BlurBackdrop'
import Paper, { PaperProps } from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

export function GalleryCard({
  item,
  actionPane,
  onClick,
  ...props
}: PaperProps & { item: Drawing; actionPane?: React.ReactNode }) {
  return (
    <Paper
      title={item?.name}
      key={item?.drawingId}
      sx={{
        backgroundColor: 'secondary.main',
        borderRadius: '16px',
        transition: 'all 100ms ease-in',
        marginRight: '0.5rem',
        display: 'flex',
        position: 'relative',
        maxWidth: '47vw',
        ':hover': {
          transform: 'scale(0.98)'
        }
      }}
      {...props}
    >
      <img
        onClick={onClick}
        src={item?.thumbnail}
        alt={item?.name}
        loading="lazy"
        style={{
          cursor: 'pointer',
          height: config.thumbnails.height,
          width: config.thumbnails.width,
          borderRadius: '16px'
        }}
        width={config.thumbnails.width}
        height={config.thumbnails.height}
      />
      <BlurBackdrop />
      <Paper
        sx={{
          opacity: 0.4,
          height: '30%',
          bottom: 0,
          left: 0,
          right: 0,
          position: 'absolute',
          display: 'flex'
        }}
      >
        <Grid
          container
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 1rem'
          }}
        >
          <Grid item>
            <Typography
              sx={{
                lineHeight: 1.5,
                fontWeight: 600
              }}
            >
              {item?.name}
            </Typography>
            <Typography
              sx={{
                lineHeight: 1.5,
                fontWeight: 400,
                fontSize: '0.75rem'
              }}
            >
              <Moment fromNow>{item.createdAt}</Moment>
            </Typography>
          </Grid>
          {actionPane && <Grid item>{actionPane}</Grid>}
        </Grid>
      </Paper>
    </Paper>
  )
}

export default GalleryCard
