import React from 'react'
import { useAppDispatch, useAppSelector } from '../shared/store'
import { AppNotification, patch } from '../features/app/slice'
import IconClose from '@mui/icons-material/Close'
import { IconButton, Snackbar } from '@mui/material'

export default function NotificationsBar() {
  const notifications = useAppSelector((store) => store.app.notifications)
  const dispatch = useAppDispatch()
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState<AppNotification | null>()

  React.useEffect(() => {
    const updateStore = (notifications: AppNotification[]) =>
      dispatch(patch({ notifications }))

    if (notifications.length > 0 && !message) {
      setMessage(notifications[0])
      setOpen(true)
      updateStore(notifications.slice(1))
    } else {
      setOpen(false)
    }
  }, [dispatch, message, notifications])

  return (
    <Snackbar
      key={message?.id}
      open={open}
      onClose={() => setOpen(false)}
      TransitionProps={{ onExited: () => setMessage(null) }}
      message={message?.message}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={3000}
      action={
        <IconButton>
          <IconClose />
        </IconButton>
      }
    />
  )
}
