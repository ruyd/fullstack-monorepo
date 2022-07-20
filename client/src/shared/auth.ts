import decode from 'jwt-decode'
import axios from 'axios'
import { AppAccessToken, User } from '@root/lib'
import { Paths } from './routes'
import config from './config'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppUser extends User {
  // client props
}

export const STORAGE_KEY = 'auth'

/**
 * Note: Auth0 rules custom props use namespace prefix: https://field
 */
export const RULE_PREFIX = 'https://'

export function decodeAccessToken(token: string): AppAccessToken | null {
  if (!token) {
    return null
  }
  try {
    const accessToken = decode(token) as AppAccessToken

    //Check lifetime
    const now = new Date().getTime() / 1000
    if (accessToken?.exp && now > accessToken.exp) {
      return null
    }

    //Remove prefix
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

export function loginRedirect() {
  const returnTo = window.location.href.replace(window.location.origin, '')
  window.location.assign(
    `${config.baseName}${Paths.Login}?returnTo=${returnTo}`
  )
}
