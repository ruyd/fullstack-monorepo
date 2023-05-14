/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Avatar,
  Badge,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  IconButton,
  styled,
  Typography
} from '@mui/material'
import { config } from '../../shared/config'
import { type Drawing, type PagedResult } from '@lib'
import { useGet } from '../app/thunks'
import { Link, useNavigate } from 'react-router-dom'
import { Paths } from '../../shared/routes'
import { notify } from '../app'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import ShareIcon from '@mui/icons-material/Share'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import waiting from '../home/images/looking.svg'
import { GalleryCard } from '../canvas/Card'
import React from 'react'
import { actions } from '../shop/slice'
import { cartAsync } from '../shop/thunks'

const StyledImage = styled('img')({
  height: '45vh',
  maxWidth: '90%'
})

export default function Gallery ({
  userId,
  onData
}: {
  userId?: string
  onData?: (items: Drawing[]) => void
}): JSX.Element {
  const dispatch = useAppDispatch()
  const loaded = useAppSelector(state => state.app.loaded)
  const navigate = useNavigate()
  const { data } = useGet<PagedResult<Drawing>>(
    'gallery',
    '/gallery' + (userId ? '/' + userId : ''),
    {
      enabled: loaded
    }
  )
  const items = data?.items ?? []
  const origin =
    window.location.origin[window.location.origin.length - 1] === '/'
      ? window.location.origin.slice(0, -1)
      : window.location.origin
  const copyLink = (item: Drawing) => {
    void navigator.clipboard.writeText(`${origin}${Paths.Draw}/${item.drawingId}`)
    void dispatch(notify('Link copied to clipboard!'))
  }
  const buy = (item: Drawing) => {
    void dispatch(cartAsync({ ...item, quantity: 1 }))
  }
  React.useEffect(() => {
    if ((onData != null) && ((data?.items) != null)) {
      onData(data?.items)
    }
  }, [onData, data?.items])

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center">
        {!items?.length && (
          <Link to={Paths.Draw} style={{ textAlign: 'center' }}>
            <StyledImage src={waiting} alt="looking" title="Waiting for first drawing" />
          </Link>
        )}
        {items?.map((item: Drawing) => (
          <Grid item key={item.drawingId}>
            <GalleryCard
              item={item}
              onClick={() => { navigate(`${Paths.Draw}/${item.drawingId}`) }}
              actionPane={
                <>
                  {item.sell && (
                    <Badge badgeContent={item.price}>
                      <IconButton onClick={() => { buy(item) }} aria-label="sharing link">
                        <AddShoppingCartIcon />
                      </IconButton>
                    </Badge>
                  )}
                  <IconButton onClick={() => { copyLink(item) }} aria-label="sharing link">
                    <ShareIcon />
                  </IconButton>
                </>
              }
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
