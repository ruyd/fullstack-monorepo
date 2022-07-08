import jwtDecode from 'jwt-decode'
import axios from 'axios'

export interface AppUser {
  [key: string]: unknown
  id: string
  email: string
  firstName?: string
  lastName?: string
  roles?: string[]
  exp?: number
  sub?: string
}
export const TOKEN_KEY = 'token'

/**
 * Auth0 roles added via rules have namespace prefix; using https://field
 */
export const RULE_PREFIX = 'https://'

export function decodeUser(token: string): AppUser | null {
  if (!token) {
    return null
  }
  try {
    const user = jwtDecode(token) as AppUser
    const keys = Object.keys(user).filter((key) => key.includes(RULE_PREFIX))
    for (const key of keys) {
      user[key.replace(RULE_PREFIX, '')] = user[key]
      delete user[key]
    }
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
  if (user.exp && user.exp > Date.now()) {
    return null
  }
  setHeader(token)
  return { token, user }
}

export function setHeader(token?: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function onLogin(payload?: string) {
  if (payload) {
    localStorage.setItem(TOKEN_KEY, payload)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
  setHeader(payload)
}
