import React from 'react'
import { Box, Card, Container, Grid } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { loadAsync } from './thunks'
import config from '../../shared/config'

export default function Gallery() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((store) => store.gallery.items)
  React.useEffect(() => {
    dispatch(loadAsync())
  }, [dispatch])
  return (
    <Container>
      <Box>
        <Grid container>
          {items.map((item) => (
            <Grid item key={item.id}>
              <Card>
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
