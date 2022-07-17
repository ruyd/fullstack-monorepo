import React from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  IconButton,
  styled,
  Typography,
} from '@mui/material'
import config from '../../shared/config'
import { Drawing, getDuration } from '@root/lib'
import { useGet } from '../../features/app/thunks'
import Moment from 'react-moment'
import { Link, useNavigate } from 'react-router-dom'
import { Paths } from 'src/shared/routes'
import { notify } from 'src/features/app'
import { useAppDispatch } from 'src/shared/store'
import ShareIcon from '@mui/icons-material/Share'
import waiting from './images/looking.svg'

const StyledImage = styled('img')({
  maxHeight: '45vh',
  maxWidth: '90%',
})

export default function Gallery() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: items } = useGet<Drawing[]>('gallery', '/drawing')
  const copyLink = (item: Drawing) => {
    navigator.clipboard.writeText(
      `${window.location.origin}${Paths.Draw}/${item.id}`
    )
    dispatch(notify('Link copied to clipboard!'))
  }

  return (
    <Container>
      <Grid container spacing={3} justifyContent="center" textAlign="center">
        {!items?.length && (
          <Link to={Paths.Draw}>
            <StyledImage
              src={waiting}
              alt="looking"
              title="Waiting for first drawing, be the first"
            />
          </Link>
        )}
        {items?.map((item: Drawing) => (
          <Grid item key={item.id}>
            <Card
              variant="outlined"
              sx={{
                borderColor: 'secondary.dark',
              }}
            >
              <CardHeader
                title={item.name}
                subheader={<Moment fromNow>{item.createdAt}</Moment>}
                avatar={
                  <Avatar
                    src={item?.user?.picture}
                    alt={item?.user?.firstName}
                  />
                }
                action={
                  <IconButton onClick={() => copyLink(item)}>
                    <ShareIcon />
                  </IconButton>
                }
              />
              <CardActionArea
                onClick={() => navigate(`${Paths.Draw}/${item.id}`)}
              >
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
                <CardContent sx={{ textAlign: 'right' }}>
                  <Typography color="primary" variant="subtitle2">
                    {getDuration(item)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
