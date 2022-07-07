import { Fab, styled } from '@mui/material'

export const StyledFab = styled(Fab)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {},
  position: 'absolute',
  right: '1em',
  bottom: '1em',
  zIndex: 1,
}))

export default StyledFab
