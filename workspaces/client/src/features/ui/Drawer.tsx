import { useAppSelector, useAppDispatch } from '../../shared/store'
import { patch } from '../app/slice'
import { Box, Card, SwipeableDrawer } from '@mui/material'
import Cart from '../shop/ShopCart'

export default function DrawerRight() {
  const dispatch = useAppDispatch()
  const open = useAppSelector(store => store.app.drawerRightOpen)
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
      <Box
        className="centered"
        sx={{ flex: '1', display: 'flex', textAlign: 'center', width: '25rem' }}
      >
        <Card sx={{ flex: 1, padding: '2rem' }}>
          <Cart />
        </Card>
      </Box>
    </SwipeableDrawer>
  )
}
