/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyAction, createAsyncThunk, ThunkDispatch } from '@reduxjs/toolkit'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import { AppUser, onLogin, getAuth0 } from '../../shared/auth'
import { getStore, RootState, store } from '../../shared/store'
import { notify, notifyError, patch } from './slice'
import { firebaseCustomTokenLogin, firebasePasswordLogin, sendEvent } from 'src/shared/firebase'
import { UserCredential } from 'firebase/auth'
import { AuthProviders, oAuthInputs } from '@lib'
import { Paths } from 'src/shared/routes'
import { send } from 'process'

export const Method = {
  GET: 'get',
  POST: 'post',
  DELETE: 'delete',
  PATCH: 'patch'
} as const

export type Method = (typeof Method)[keyof typeof Method]

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
  let response: AxiosResponse<R & { message: string }>
  const dispatch = getStore().dispatch
  const state = getStore().getState()?.app
  try {
    dispatch(patch({ loading: true }))
    response = await axios({
      ...options,
      url,
      data,
      method
    })
  } catch (err: unknown) {
    const error = err as Error
    response = (
      error as unknown as {
        response: AxiosResponse
      }
    ).response
    if (state.user && url !== 'profile/login' && response?.status === 401) {
      onLogin()
      dispatch(patch({ dialog: 'onboard', token: undefined, user: undefined, loading: false }))
    }
    dispatch(notifyError(response?.data?.message || error.message))
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

async function setCustomToken(authProvider?: string, token?: string) {
  if (authProvider !== AuthProviders.Firebase) {
    return
  }
  await firebaseCustomTokenLogin(token as string)
}

export const loginAsync = createAsyncThunk(
  'app/login',
  async ({ email, password }: oAuthInputs, { dispatch, getState }) => {
    try {
      const state = getState() as RootState
      dispatch(patch({ loading: true }))
      const { idToken } = (await firebasePasswordLogin(email as string, password as string)) as {
        idToken: string
      } & UserCredential['user']

      const response = await request<{
        token: string
        user: AppUser
        message?: string
      }>('profile/login', { email, password, idToken })

      if (response.status === 200) {
        await setCustomToken(state?.app?.settings?.system?.authProvider, response.data.token)
        setLogin(dispatch, response.data.token, response.data.user)
        if (state.app.dialog === 'onboard') {
          dispatch(patch({ dialog: undefined }))
        }
      } else {
        dispatch(notifyError('Login error' + response.data.message))
      }
    } catch (err) {
      const error = err as Error & { response?: { data?: { message?: string } } }
      const message = error.response?.data?.message || error.message
      dispatch(notifyError(message))
    }
    dispatch(patch({ loading: false }))
  }
)

export const socialLoginAsync = createAsyncThunk(
  'app/login/social',
  async (payload: oAuthInputs, { dispatch }) => {
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

export const tapLoginAsync = createAsyncThunk(
  'app/login/tap',
  async (payload: oAuthInputs, { dispatch, getState }) => {
    try {
      const response = await request<{
        token: string
        user: AppUser
        message?: string
      }>('profile/login', payload)
      if (response.status === 200) {
        const state = getState() as RootState
        await setCustomToken(state?.app?.settings?.system?.authProvider, response.data.token)
        setLogin(dispatch, response.data.token, response.data.user)
        if (state.app.dialog === 'onboard') {
          dispatch(patch({ dialog: undefined }))
        }
        sendEvent('login.success')
      } else {
        dispatch(notifyError('Login error' + response.data.message))
        sendEvent('login.error', { message: response.data.message })
      }
    } catch (err) {
      const error = err as Error
      dispatch(notifyError(error.message))
      sendEvent('login.unhandledError', { message: error.message })
      return
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
      sendEvent('register.error', { message: response.data.message })
      return
    }
    //For email validation rework this
    setLogin(dispatch, response.data.token, response.data.user)
    if (state.app.dialog === 'onboard.register') {
      dispatch(patch({ dialog: undefined }))
    }
    sendEvent('register.success', { email: payload.email })
  }
)

export const logoutAsync = createAsyncThunk('app/logout', async (_, { dispatch, getState }) => {
  const state = getState() as RootState
  const email = state?.app?.user?.email
  request('profile/logoff')
  dispatch(patch({ token: undefined, user: undefined }))
  onLogin(undefined)
  dispatch(notify('Have a nice day, bye'))
  sendEvent('logout', { email })
})

export const editProfileAsync = createAsyncThunk(
  'app/editProfile',
  async (payload: Record<string, unknown>, { dispatch, getState }) => {
    const state = getState() as RootState
    const response = await request<{ token: string; user: AppUser }>('profile/edit', payload)
    const user = response.data.user
    if (user) {
      const token = state?.app?.token as string
      dispatch(patch({ user }))
      onLogin({ token, user })
    }
    sendEvent('editProfile')
  }
)

export const forgotAsync = createAsyncThunk(
  'app/forgot',
  async (payload: { email: string }, { dispatch }) => {
    const response = await request('profile/forgot', payload)
    dispatch(notify(response.data?.message || 'Recovery could not be sent'))
    sendEvent('forgot', { email: payload.email })
  }
)
