import React from 'react'
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Container,
  Grid,
} from '@mui/material'
import config from '../../shared/config'
import { Drawing } from '@root/lib'
import { useGet } from '../../features/app/thunks'
import Moment from 'react-moment'
import { useNavigate } from 'react-router-dom'

export default function Gallery() {
  //const newItems = useAppSelector(socket.items)
  const navigate = useNavigate()
  const { data: items } = useGet<Drawing[]>('gallery', '/drawing')
  return (
    <Container>
      <Grid container spacing={3}>
        {items?.map((item: Drawing) => (
          <Grid item key={item.id}>
            <Card
              onClick={() => navigate(`/drawing/${item.id}`)}
              variant="outlined"
              sx={{
                borderColor: 'secondary.dark',
              }}
            >
              <CardActionArea>
                <CardHeader
                  title={item.name}
                  subheader={<Moment fromNow>{item.createdAt}</Moment>}
                  avatar={
                    <Avatar
                      src={item?.user?.picture}
                      alt={item?.user?.firstName}
                    />
                  }
                />
                <CardMedia
                  component="img"
                  src={item.thumbnail}
                  alt={item.name}
                  loading="lazy"
                  style={{
                    height: config.thumbnails.height,
                    width: config.thumbnails.width,
                  }}
                  width={config.thumbnails.width}
                  height={config.thumbnails.height}
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
