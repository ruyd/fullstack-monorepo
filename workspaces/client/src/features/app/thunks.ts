import { AnyAction, createAsyncThunk, ThunkDispatch } from '@reduxjs/toolkit'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import { AppUser, onLogin, getAuthProvider } from '../../shared/auth'
import { RootState, store } from '../../shared/store'
import { notify, notifyError, patch } from './slice'

export const Method = {
  GET: 'get',
  POST: 'post',
  DELETE: 'delete',
  PATCH: 'patch',
} as const

export type Method = typeof Method[keyof typeof Method]

/**
 * Axios wrapper for thunks with token from onLogin
 */
export async function request<
  R = { success: boolean; message: string },
  T = Record<string, unknown>,
>(
  url: string,
  data?: T,
  method: Method = Method.POST,
  options?: AxiosRequestConfig<R>,
): Promise<AxiosResponse<R>> {
  let response: AxiosResponse<R>
  const dispatch = store.dispatch
  try {
    dispatch(patch({ loading: true }))
    response = await axios({
      ...options,
      // headers:{ Authorization: `Bearer ${token}` },
      url,
      data,
      method,
    })
  } catch (err: unknown) {
    const error = err as Error
    const resp = (
      error as unknown as {
        response: AxiosResponse<{ message: string }>
      }
    ).response
    if (resp?.status === 401) {
      dispatch(patch({ dialog: 'onboard', token: undefined }))
    }
    dispatch(notifyError(resp?.data?.message || error.message))
    throw error
  } finally {
    dispatch(patch({ loading: false }))
  }
  return response
}

/**
 * Generic API GET Hook for components
 * @param cacheKey
 * @param url
 * @param options react-query useQueryOptions
 * @returns
 */

export const get = <T>(url: string, options?: AxiosRequestConfig<T>) =>
  request<T>(url, {}, Method.GET, options)

/**
 * Generic API GET Hook for components
 * @param cacheKey
 * @param url
 * @param options react-query useQueryOptions
 * @returns
 */
export const useGet = <T>(
  cacheKey: string,
  url: string,
  options?: UseQueryOptions<T>,
  queryParams?: unknown,
) =>
  useQuery<T>(
    cacheKey,
    async () => {
      if (!url) {
        return null as T
      }
      const params = convertToQueryParams(queryParams)
      const resp = await get<T>(url + params)
      return resp.data
    },
    options,
  )

export function convertToQueryParams(obj: unknown | undefined) {
  return obj
    ? '?' +
        Object.entries(obj)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
    : ''
}

function setLogin(
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
  token: string,
  user: AppUser,
) {
  onLogin({ token, user })
  dispatch(
    patch({
      token,
      user,
      loaded: !!token,
      dialog: undefined,
    }),
  )
}

export const loginAsync = createAsyncThunk(
  'app/login',
  async (payload: Record<string, unknown>, { dispatch }) => {
    const response = await request<{ token: string; user: AppUser }>('profile/login', payload)
    setLogin(dispatch, response.data.token, response.data.user)
  },
)

/**
 * Link with local backend, update metadata
 */
export const socialLoginAsync = createAsyncThunk(
  'app/login/social',
  async (payload: Record<string, unknown>, { dispatch }) => {
    const response = await request<{ token: string; user: AppUser; renew: boolean }>(
      'profile/social',
      payload,
    )
    const { token, user, renew } = response.data
    if (renew) {
      const auth = getAuthProvider()
      auth.checkSession({}, (err, result) => {
        if (err) {
          dispatch(notifyError(JSON.stringify(err)))
          return
        }
        setLogin(dispatch, result.accessToken, user)
      })
    } else {
      setLogin(dispatch, token, user)
    }
  },
)

export const registerAsync = createAsyncThunk(
  'app/register',
  async (payload: Record<string, unknown>, { dispatch }) => {
    const response = await request<{ token: string; user: AppUser }>('profile/register', payload)
    //For email validation rework this
    setLogin(dispatch, response.data.token, response.data.user)
  },
)

export const logoutAsync = createAsyncThunk('app/logout', async (_, { dispatch }) => {
  request('profile/logoff')
  dispatch(patch({ token: undefined, user: undefined }))
  onLogin(undefined)
  dispatch(notify('Have a nice day, bye'))
})

export const editProfileAsync = createAsyncThunk(
  'app/editProfile',
  async (payload: Record<string, unknown>, { dispatch, getState }) => {
    const response = await request<{ token: string; user: AppUser }>('profile/edit', payload)
    const user = response.data.user
    if (user) {
      const token = (getState() as RootState)?.app?.token as string
      dispatch(patch({ user }))
      onLogin({ token, user })
    }
  },
)

export const forgotAsync = createAsyncThunk(
  'app/forgot',
  async (payload: { email: string }, { dispatch }) => {
    const response = await request('profile/forgot', payload)
    dispatch(notify(response.data?.message || 'Recovery could not be sent'))
  },
)
