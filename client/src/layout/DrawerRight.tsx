import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'

export default function DrawerRight() {
  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={() => {}}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <div>
        <div className="drawer-header">
          <div className="drawer-header-title">
            <Typography variant="h6">Drawer Right</Typography>
          </div>
          <div className="drawer-header-close">
            <IconButton aria-label="close" onClick={() => {}}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className="drawer-content">
          <Typography variant="h6">Drawer Right</Typography>
        </div>
      </div>
    </Drawer>
  )
}
