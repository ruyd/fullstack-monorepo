import { AnyAction, createAsyncThunk, ThunkDispatch } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'
import { AppUser, decodeUser, onLogin } from '../../shared/auth'
import { notify, notifyError, patch } from './slice'

const options = {
  validateStatus: () => true,
}

export async function request(
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
  url: string,
  data: any
): Promise<AxiosResponse> {
  let response: AxiosResponse
  try {
    dispatch(patch({ loading: true }))
    response = await axios({ ...options, url, data, method: 'post' })
    if (response.status !== 200) {
      dispatch(notifyError(response.data.message))
      throw new Error(response.statusText)
    }
  } catch (error: any) {
    dispatch(notifyError(error.message))
    throw error
  } finally {
    dispatch(patch({ loading: false }))
  }
  return response
}

export const LoginAsync = createAsyncThunk(
  'app/login',
  async (payload: { email: string; password: string }, { dispatch }) => {
    const response = await request(dispatch, 'profile/login', payload)
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
    const response = await request(dispatch, 'profile/register', payload)
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
