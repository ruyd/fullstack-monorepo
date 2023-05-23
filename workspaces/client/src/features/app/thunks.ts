/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyAction, createAsyncThunk, ThunkDispatch } from '@reduxjs/toolkit'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import { AppUser, onLogin, getAuth0 } from '../../shared/auth'
import { RootState, store } from '../../shared/store'
import { notify, notifyError, patch } from './slice'
import { firebaseCustomTokenLogin, firebasePasswordLogin } from 'src/shared/firebase'
import { UserCredential } from 'firebase/auth'
import { AuthProviders } from '@lib'

export const Method = {
  GET: 'get',
  POST: 'post',
  DELETE: 'delete',
  PATCH: 'patch'
} as const

export type Method = typeof Method[keyof typeof Method]

/**
 * Axios wrapper for thunks with token from onLogin
 */
export async function request<
  R = { success: boolean; message: string },
  T = Record<string, unknown> | object
>(
  url: string,
  data?: T,
  method: Method = Method.POST,
  options?: AxiosRequestConfig<R>
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
      method
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
  queryParams?: unknown
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
    options
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
  user: AppUser
) {
  onLogin({ token, user })
  dispatch(
    patch({
      token,
      user,
      loaded: !!token
    })
  )
}

export const loginAsync = createAsyncThunk(
  'app/login',
  async (payload: Record<string, string>, { dispatch, getState }) => {
    try {
      const state = getState() as RootState
      dispatch(patch({ loading: true }))
      const { idToken } = (await firebasePasswordLogin(
        payload.email as string,
        payload.password as string
      )) as { idToken: string } & UserCredential['user']

      const response = await request<{
        token: string
        user: AppUser
        message?: string
      }>('profile/login', { ...payload, idToken })

      if (response.status === 200) {
        if (state?.app?.settings?.system?.authProvider === AuthProviders.Firebase) {
          const result = await firebaseCustomTokenLogin(response.data.token)
          console.log('compare', response.data.token, result.user.accessToken)
        }
        setLogin(dispatch, response.data.token, response.data.user)
        if (state.app.dialog === 'onboard') {
          dispatch(patch({ dialog: undefined }))
        }
      } else {
        dispatch(notifyError('Login error' + response.data.message))
      }
    } catch (err) {
      const error = err as Error
      dispatch(notifyError(error.message))
      return
    }
  }
)

/**
 * Link with local backend, update metadata
 */
export const socialLoginAsync = createAsyncThunk(
  'app/login/social',
  async (payload: Record<string, unknown>, { dispatch }) => {
    const response = await request<{ token: string; user: AppUser; renew: boolean }>(
      'profile/social',
      payload
    )
    const { token, renew } = response.data
    if (renew) {
      const auth = getAuth0()
      auth.checkSession({}, (err, result) => {
        if (err) {
          dispatch(notifyError(JSON.stringify(err)))
          return
        }
        setLogin(dispatch, result.accessToken, response.data.user)
      })
    } else {
      setLogin(dispatch, token, response.data.user)
    }
  }
)

export const registerAsync = createAsyncThunk(
  'app/register',
  async (payload: Record<string, unknown>, { dispatch, getState }) => {
    const state = getState() as RootState

    const response = await request<{ token: string; user: AppUser; message?: string }>(
      'profile/register',
      payload
    )
    if (response.status !== 200) {
      dispatch(notifyError('Register error' + response.data.message))
      return
    }
    //For email validation rework this
    setLogin(dispatch, response.data.token, response.data.user)
    if (state.app.dialog === 'onboard.register') {
      dispatch(patch({ dialog: undefined }))
    }
  }
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
  }
)

export const forgotAsync = createAsyncThunk(
  'app/forgot',
  async (payload: { email: string }, { dispatch }) => {
    const response = await request('profile/forgot', payload)
    dispatch(notify(response.data?.message || 'Recovery could not be sent'))
  }
)
