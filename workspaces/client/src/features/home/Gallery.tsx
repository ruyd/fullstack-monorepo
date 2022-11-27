/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Avatar,
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
import waiting from './images/looking.svg'
import { GalleryCard } from '../canvas/Card'

const StyledImage = styled('img')({
  height: '45vh',
  maxWidth: '90%',
})

export default function Gallery() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data } = useGet<PagedResult<Drawing>>('gallery', '/gallery')
  const items = data?.items || []
  const origin =
    window.location.origin[window.location.origin.length - 1] === '/'
      ? window.location.origin.slice(0, -1)
      : window.location.origin
  const copyLink = (item: Drawing) => {
    navigator.clipboard.writeText(`${origin}${Paths.Draw}/${item.id}`)
    dispatch(notify('Link copied to clipboard!'))
  }

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
                <IconButton onClick={() => copyLink(item)} aria-label="sharing link">
                  <ShareIcon />
                </IconButton>
              }
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
