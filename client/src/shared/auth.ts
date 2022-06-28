import { Middleware } from '@reduxjs/toolkit'
import jwtDecode from 'jwt-decode'
import { login } from '../features/app/slice'
import axios from 'axios'

export interface AppUser {
  id: string
  name: string
  expiration: number
}
export const TOKEN_KEY = 'token'

export function decodeUser(token: string): AppUser | null {
  if (!token) {
    return null
  }
  try {
    const user = jwtDecode(token) as AppUser
    return user
  } catch {
    return null
  }
}

export function getPersistedAuthFromStorage(): {
  token: string
  user: AppUser
} | null {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    return null
  }
  const user = decodeUser(token)
  if (!user) {
    return null
  }
  if (user.expiration && user.expiration > Date.now()) {
    return null
  }
  setHeader(token)
  return { token, user }
}

export function setHeader(token: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function onLogin(payload: string) {
  localStorage.setItem(TOKEN_KEY, payload)
  setHeader(payload)
}

/**
 * Hmm
 **/
export const authMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action)
  if (login.match(action)) {
    onLogin(action.payload)
  }
  return result
}
