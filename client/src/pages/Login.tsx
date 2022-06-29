import { Box, Button, Paper, TextField } from '@mui/material'
import { LoginAsync } from '../features/app/thunks'
import { useAppDispatch } from '../shared/store'

export default function Login() {
  const dispatch = useAppDispatch()
  const loginHandler = () => dispatch(LoginAsync({ email: 'a', password: 'x' }))
  return (
    <Paper>
      <Box>
        <h1>Login</h1>
        <TextField label="Email" />
        <TextField label="Password" />
        <Button onClick={loginHandler}>Login</Button>
      </Box>
    </Paper>
  )
}
