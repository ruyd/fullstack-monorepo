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
  Typography,
} from '@mui/material'
import { config } from '../../shared/config'
import { Drawing, PagedResult } from '@shared/lib'
import { useGet } from '../app/thunks'
import { Link, useNavigate } from 'react-router-dom'
import { Paths } from '../../shared/routes'
import { notify } from '../app'
import { useAppDispatch } from '../../shared/store'
import ShareIcon from '@mui/icons-material/Share'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import waiting from '../home/images/looking.svg'
import { GalleryCard } from '../canvas/Card'
import React from 'react'

const StyledImage = styled('img')({
  height: '45vh',
  maxWidth: '90%',
})

export default function Gallery({
  userId,
  onData,
}: {
  userId?: string
  onData?: (items: Drawing[]) => void
}): JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data } = useGet<PagedResult<Drawing>>(
    'gallery',
    '/gallery' + (userId ? '/' + userId : ''),
  )
  const items = data?.items || []
  const origin =
    window.location.origin[window.location.origin.length - 1] === '/'
      ? window.location.origin.slice(0, -1)
      : window.location.origin
  const copyLink = (item: Drawing) => {
    navigator.clipboard.writeText(`${origin}${Paths.Draw}/${item.id}`)
    dispatch(notify('Link copied to clipboard!'))
  }
  const buy = (item: Drawing) => {
    dispatch(notify(`${item.price} added to Cart`))
  }
  React.useEffect(() => {
    if (onData && data?.items) {
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
          <Grid item key={item.id}>
            <GalleryCard
              item={item}
              onClick={() => navigate(`${Paths.Draw}/${item.id}`)}
              actionPane={
                <>
                  {item.sell && (
                    <Badge badgeContent={item.price}>
                      <IconButton onClick={() => buy(item)} aria-label="sharing link">
                        <AddShoppingCartIcon />
                      </IconButton>
                    </Badge>
                  )}
                  <IconButton onClick={() => copyLink(item)} aria-label="sharing link">
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
