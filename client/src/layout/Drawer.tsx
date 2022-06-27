import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { useAppSelector, useAppDispatch } from '../shared/store'
import { patch } from '../features/app/slice'
import { Box, Paper } from '@mui/material'

export default function DrawerRight() {
  const dispatch = useAppDispatch()
  const open = useAppSelector((store) => store.app.drawerRightOpen)
  const toggleOpen = () => {
    dispatch(patch({ drawerRightOpen: !open }))
  }
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleOpen}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Paper sx={{ width: '300px', flex: 1 }}>
        <div className="drawer-header">
          <div className="drawer-header-title">
            <Typography variant="h6">Drawer Right</Typography>
          </div>
          <div className="drawer-header-close">
            <IconButton aria-label="close" onClick={toggleOpen}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className="drawer-content">
          <Typography variant="h6">Drawer Right</Typography>
        </div>
      </Paper>
    </Drawer>
  )
}
