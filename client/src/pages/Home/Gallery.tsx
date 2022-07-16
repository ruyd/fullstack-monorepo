import React from 'react'
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
} from '@mui/material'
import config from '../../shared/config'
import { Drawing, getDuration, getTimeSpent } from '@root/lib'
import { useGet } from '../../features/app/thunks'
import Moment from 'react-moment'
import { useNavigate } from 'react-router-dom'
import { Paths } from 'src/shared/routes'

export default function Gallery() {
  //const newItems = useAppSelector(socket.items)
  const navigate = useNavigate()
  const { data: items } = useGet<Drawing[]>('gallery', '/drawing')
  return (
    <Container>
      <Grid container spacing={3} justifyContent="center">
        {items?.map((item: Drawing) => (
          <Grid item key={item.id}>
            <Card
              onClick={() => navigate(`${Paths.Draw}/${item.id}`)}
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
                <CardContent>Time: {getDuration(item)}</CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
