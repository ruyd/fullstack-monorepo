import React from 'react'
import { Box, Card, CardHeader, Container, Grid } from '@mui/material'
import config from '../../shared/config'
import { Drawing } from '@root/lib'
import { useGet } from '../app/thunks'

export default function Gallery() {
  const { data: items } = useGet<Drawing[]>('gallery', '/drawing')
  return (
    <Container>
      <Box>
        <Grid container>
          {items?.map((item) => (
            <Grid item key={item.id}>
              <Card>
                <CardHeader>{item.name}</CardHeader>
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
