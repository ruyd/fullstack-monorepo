import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export interface ShowDialogProps {
  open: boolean
  title?: string
  message?: string
  payload?: unknown
  onConfirm?: () => void
  onCancel?: () => void
  alert?: boolean
}

export default function ConfirmDialog({
  message,
  title,
  open,
  onCancel,
  onConfirm,
  alert
}: ShowDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {!alert && <Button onClick={onCancel}>No</Button>}
        <Button onClick={onConfirm} autoFocus>
          {alert ? 'OK' : 'Agree - Yes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
