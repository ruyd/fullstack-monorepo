import { createAsyncThunk } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'
import { AppUser, decodeUser, onLogin } from '../../shared/auth'
import { notify, notifyError, patch } from './slice'

const options = {
  validateStatus: () => true,
}

const error = (response: AxiosResponse) =>
  notifyError(
    response?.data?.message || `${response.status}: ${response.statusText}`
  )

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
    onLogin(response.data.token)
  }
)

export const RegisterAsync = createAsyncThunk(
  'app/register',
  async (payload: unknown, { dispatch }) => {
    dispatch(patch({ loading: true }))
    const response = await axios.post('profile/register', payload, options)
    if (!response?.data?.token) {
      dispatch(patch({ loading: false }))
      dispatch(error(response))
      return
    }
    const user = decodeUser(response.data.token) as AppUser
    dispatch(
      patch({
        token: response.data.token,
        user,
        loading: false,
      })
    )
    onLogin(response.data.token)
  }
)
