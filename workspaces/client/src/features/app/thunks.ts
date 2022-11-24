/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyAction, createAsyncThunk, ThunkDispatch } from '@reduxjs/toolkit'
import { Auth0Error } from 'auth0-js'
import axios, { AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import { AppUser, onLogin, getAuthProvider, loginPrompt } from '../../shared/auth'
import { RootState, store } from '../../shared/store'
import { notify, notifyError, patch } from './slice'

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
  R = { success: boolean; message: string },
  T = Record<string, unknown>,
>(url: string, data?: T, method: Method = Method.POST): Promise<AxiosResponse<R>> {
  let response: AxiosResponse<R>
  const dispatch = store.dispatch
  try {
    dispatch(patch({ loading: true }))
    response = await axios({
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

export const get = <T>(url: string) => request<T>(url, {}, Method.GET)

/**
 * Generic API GET Hook for components
 * @param cacheKey
 * @param url
 * @param options react-query useQueryOptions
 * @returns
 */
export const useGet = <T>(cacheKey: string, url: string, options?: UseQueryOptions<T>) =>
  useQuery<T>(
    cacheKey,
    async () => {
      const resp = await get<T>(url)
      return resp.data
    },
    options,
  )

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
