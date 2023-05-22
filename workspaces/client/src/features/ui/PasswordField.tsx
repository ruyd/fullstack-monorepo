import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import InputAdornment from '@mui/material/InputAdornment'
import { TextField, TextFieldProps } from '@mui/material'
import React from 'react'

export default function PasswordField(props: TextFieldProps) {
  const [visible, setVisible] = React.useState(false)
  return (
    <TextField
      autoComplete="current-password"
      name="password"
      label="Password"
      type={visible ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setVisible(!visible)
            }}
          >
            {visible ? <Visibility /> : <VisibilityOff />}
          </InputAdornment>
        )
      }}
      {...props}
    />
  )
}
