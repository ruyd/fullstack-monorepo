import React from 'react'
import { Avatar, Box, Card, CardHeader, Container, Grid } from '@mui/material'
import config from '../../shared/config'
import { Drawing } from '@root/lib'
import { useGet } from '../../features/app/thunks'
import Moment from 'react-moment'

export default function Gallery() {
  //const newItems = useAppSelector(socket.items)
  const { data: items } = useGet<Drawing[]>('gallery', '/drawing')
  return (
    <Container maxWidth={false}>
      <Box>
        <Grid container>
          {items?.map((item: Drawing) => (
            <Grid item key={item.id}>
              <Card>
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
                <img
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
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}
