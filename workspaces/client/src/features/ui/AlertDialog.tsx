import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

export interface AlertDialogProps {
  open: boolean
  title?: string
  message?: string
  payload?: string | number | object
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
  alert,
}: AlertDialogProps) {
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
          {alert ? 'OK' : 'Agree'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
