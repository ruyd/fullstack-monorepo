/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyAction, createAsyncThunk, ThunkDispatch } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'
import config from 'src/shared/config'
import { useQuery, UseQueryOptions } from 'react-query'
import { loginPrompt } from 'src/shared/auth'
import { PagedResult } from '../../../../lib/src/types'
import { RootState, store } from '../../shared/store'
import { Method, notifyError } from '../app'
import { patch as patchApp } from '../app'
import { patch } from './slice'
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
      dispatch(patchApp({ dialog: 'onboard', token: undefined }))
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

export const loadDataAsync = createAsyncThunk(
  'admin/data/read',
  async (name: string, { dispatch, getState }) => {
    const response = await get<PagedResult>(`${name}`)
    dispatch(patch({ data: { [name]: { ...response.data } } }))
  },
)
