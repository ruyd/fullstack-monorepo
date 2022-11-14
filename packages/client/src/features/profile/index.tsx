import { Dialog } from '@mui/material'
import { useAppDispatch } from '../../shared/store'
import Login from './Login'

export default function Dialogs(): JSX.Element {
  const dispatch = useAppDispatch()
  dispatch({ type: 'test' })
  return (
    <Dialog open={true}>
      <Login />
    </Dialog>
  )
}
