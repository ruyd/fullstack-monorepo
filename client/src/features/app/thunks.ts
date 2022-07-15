import { AnyAction, createAsyncThunk, ThunkDispatch } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import { AppUser, onLogin } from '../../shared/auth'
import { RootState, store } from '../../shared/store'
import { notifyError, patch } from './slice'

export enum Method {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PATCH = 'patch',
}

/**
 * Axios wrapper for thunks with token from onLogin
 */
export async function request<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  R = { success: true } | any,
  T = Record<string, unknown>
>(
  url: string,
  data?: T,
  method: Method = Method.POST
): Promise<AxiosResponse<R>> {
  let response: AxiosResponse<R>
  const dispatch = store.dispatch
  try {
    dispatch(patch({ loading: true }))
    response = await axios({
      url,
      data,
      method,
      timeout: 10000,
    })
  } catch (err: unknown) {
    const error = err as Error & { response: AxiosResponse }
    if (error?.response?.data?.message.includes('expired')) {
      window.location.assign('./login')
    }
    dispatch(notifyError(error?.response?.data?.message || error.message))
    throw error
  } finally {
    dispatch(patch({ loading: false }))
  }
  return response
}

export const get = <T>(url: string) => request<T>(url, {}, Method.GET)

/**
 * Generic GET Hook for components
 * @param cacheKey
 * @param url
 * @param options react-query useQueryOptions
 * @returns
 */
export const useGet = <T>(
  cacheKey: string,
  url: string,
  options?: UseQueryOptions<T>
) =>
  useQuery<T>(
    cacheKey,
    async () => {
      const resp = await get<T>(url)
      return resp.data
    },
    options
  )

function setLogin(
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
  token: string,
  user: AppUser
) {
  dispatch(
    patch({
      token,
      user,
      loaded: !!token,
    })
  )
  onLogin({ token, user })
}

export const LoginAsync = createAsyncThunk(
  'app/login',
  async (payload: Record<string, unknown>, { dispatch }) => {
    const response = await request<{ token: string; user: AppUser }>(
      'profile/login',
      payload
    )
    setLogin(dispatch, response.data.token, response.data.user)
  }
)

export const RegisterAsync = createAsyncThunk(
  'app/register',
  async (payload: Record<string, unknown>, { dispatch }) => {
    const response = await request('profile/register', payload)
    //For email validation rework this
    setLogin(dispatch, response.data.token, response.data.user)
  }
)

export const LogoutAsync = createAsyncThunk(
  'app/logout',
  async (_, { dispatch }) => {
    await request('profile/logoff')
    dispatch(patch({ token: undefined, user: undefined }))
    onLogin(undefined)
  }
)

export const EditProfileAsync = createAsyncThunk(
  'app/editProfile',
  async (payload: Record<string, unknown>, { dispatch, getState }) => {
    const response = await request('profile/edit', payload)
    const user = response.data.user
    if (user) {
      const token = (getState() as RootState)?.app?.token as string
      dispatch(patch({ user }))
      onLogin({ token, user })
    }
  }
)
