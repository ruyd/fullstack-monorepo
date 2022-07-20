import CloseIcon from '@mui/icons-material/Close'
import { useAppSelector, useAppDispatch } from '../shared/store'
import { patch } from '../features/app/slice'
import {
  Card,
  Container,
  IconButton,
  SwipeableDrawer,
  Typography,
} from '@mui/material'

export default function DrawerRight() {
  const dispatch = useAppDispatch()
  const open = useAppSelector((store) => store.app.drawerRightOpen)
  const toggleOpen = () => {
    dispatch(patch({ drawerRightOpen: !open }))
  }
  return (
    <SwipeableDrawer
      anchor="right"
      open={!!open}
      onClose={toggleOpen}
      onOpen={() => ''}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Container className="centered" sx={{ flex: '1', textAlign: 'center' }}>
        <Card sx={{ padding: '2rem' }} onClick={toggleOpen}>
          <Typography variant="h4" sx={{ pointerEvents: 'none' }}>
            Placeholder
          </Typography>
          <IconButton aria-label="close">
            <CloseIcon />
          </IconButton>
        </Card>
      </Container>
    </SwipeableDrawer>
  )
}
