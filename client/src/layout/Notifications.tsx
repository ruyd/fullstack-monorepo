import React from 'react'
import { useAppDispatch, useAppSelector } from '../shared/store'
import { AppNotification, patch } from '../features/app/slice'
import { Alert, Snackbar } from '@mui/material'

export default function Notifications() {
  const notifications = useAppSelector(store => store.app.notifications)
  const dispatch = useAppDispatch()
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState<AppNotification | null>(null)

  const update = React.useCallback(
    (notifications: AppNotification[]) => {
      dispatch(patch({ notifications }))
    },
    [dispatch],
  )

  const close = React.useCallback(() => {
    setOpen(false)
  }, [])

  React.useEffect(() => {
    if (notifications.length > 0 && !message) {
      setMessage({ ...notifications[0] })
      update(notifications.slice(1))
      setOpen(true)
    } else if (notifications.length && message && open) {
      setOpen(false)
    }
  }, [dispatch, message, notifications, open, update])

  return (
    <Snackbar
      key={message?.id}
      open={open}
      onClose={close}
      TransitionProps={{ onExited: () => setMessage(null) }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={3000}
    >
      <Alert key={message?.id} onClose={close} severity={message?.severity} sx={{ mb: '2rem' }}>
        {message?.message}
      </Alert>
    </Snackbar>
  )
}
