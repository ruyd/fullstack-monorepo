export enum NotificationSeverity {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
}
export interface AppNotification {
  id: string
  message: string
  severity?: NotificationSeverity
  closed?: boolean
}
