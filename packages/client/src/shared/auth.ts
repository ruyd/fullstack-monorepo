import jwtDecode, { JwtPayload } from 'jwt-decode'
import axios from 'axios'

export interface AppUser {
  [key: string]: unknown
  userId: string
  email: string
  firstName?: string
  lastName?: string
}

export interface AppAccessToken extends JwtPayload {
  userId: string
  roles: string[]
  [key: string]: any
}

export const STORAGE_KEY = 'auth'

/**
 * Auth0 roles added via rules have namespace prefix; using https://field
 */
export const RULE_PREFIX = 'https://'

export function decodeAccessToken(token: string): AppAccessToken | null {
  if (!token) {
    return null
  }
  try {
    const accessToken = jwtDecode(token) as AppAccessToken
    const keys = Object.keys(accessToken).filter((key) =>
      key.includes(RULE_PREFIX)
    )
    for (const key of keys) {
      accessToken[key.replace(RULE_PREFIX, '')] = accessToken[key]
      delete accessToken[key]
    }
    return accessToken
  } catch {
    return null
  }
}

export function getPersistedAuthFromStorage(): {
  token: string
  user: AppUser
} | null {
  const json = localStorage.getItem(STORAGE_KEY)
  if (!json) {
    return null
  }

  const { token, user } = JSON.parse(json)
  const accessToken = decodeAccessToken(token)
  if (!accessToken) {
    return null
  }
  if (accessToken?.exp && user.exp > Date.now()) {
    return null
  }
  setHeader(token)
  return { token, user }
}

export function setHeader(token?: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function onLogin(payload?: { token: string; user: AppUser }) {
  if (payload) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
  setHeader(payload?.token)
}
