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
import GalleryCard from '../canvas/Item'

const StyledImage = styled('img')({
  height: '45vh',
  maxWidth: '90%',
})

export default function Gallery() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data } = useGet<PagedResult<Drawing>>('gallery', '/gallery')
  const items = data?.items || []
  const copyLink = (item: Drawing) => {
    navigator.clipboard.writeText(
      `${window.location.origin}${config.baseName}${Paths.Draw}/${item.id}`,
    )
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
            <GalleryCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
