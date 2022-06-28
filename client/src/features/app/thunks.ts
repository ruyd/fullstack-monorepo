import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { patch } from './slice'

export const LoginAsync = createAsyncThunk(
  'app/login',
  async (
    { email, password }: { email: string; password: string },
    { dispatch }
  ) => {
    dispatch(patch({ loading: true }))
    const response = await axios.post('profile/login', { email, password })
    dispatch(
      patch({
        token: response.data.token,
        user: response.data.user,
        loading: false,
      })
    )
  }
)
