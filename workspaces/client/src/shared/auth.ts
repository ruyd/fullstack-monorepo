import decode from 'jwt-decode'
import axios from 'axios'
import { Jwt, User } from '@shared/lib'
import { Paths } from './routes'
import config from './config'
import authProvider from 'auth0-js'
import { v4 } from 'uuid'
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppUser extends User {
  // client props
}

export interface Nonce {
  userId?: string
  nonce: string
  state: string
}

export const STORAGE_KEY = 'auth'
export const NONCE_KEY = 'nonce'

/**
 * Note: Auth0 rules custom props use namespace prefix: https://field
 */
export const RULE_PREFIX = 'https://'

export function decodeToken(token: string): Jwt | null {
  if (!token) {
    return null
  }
  try {
    const accessToken = decode(token) as Jwt

    //Check lifetime
    const now = new Date().getTime() / 1000
    if (accessToken?.exp && now > accessToken.exp) {
      return null
    }

    //Remove prefix
    const keys = Object.keys(accessToken).filter(key => key.includes(RULE_PREFIX))
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
  const accessToken = decodeToken(token)
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
  clearNonce()
}

export function loginPrompt() {
  const returnTo = window.location.href
    .replace(window.location.origin, '')
    .replace(config.baseName, '')
  window.location.assign(`${config.baseName}${Paths.Login}?returnTo=${returnTo}`)
}

export async function checkSocialToken(token: string): Promise<string | undefined> {
  const response = await axios.post<{ userId?: string }>(`profile/social/check`, {
    token,
  })
  return response.data?.userId
}
export const authOptions = () => ({
  domain: config.auth.domain,
  clientID: config.auth.clientId,
  audience: config.auth.audience,
  redirectUri: config.auth.redirectUrl,
  responseType: 'id_token token',
  scope: 'openid profile email',
})

export function getAuthProvider(overrides: Partial<typeof authOptions> = {}) {
  return new authProvider.WebAuth({ ...authOptions(), ...overrides })
}

export function generateNonce(userId?: string) {
  const session = { userId, state: v4(), nonce: v4() }
  localStorage.setItem(NONCE_KEY, JSON.stringify(session))
  return session
}

export function getNonce() {
  const nonce = localStorage.getItem(NONCE_KEY)
  return JSON.parse(nonce || '{}')
}

export function clearNonce() {
  localStorage.removeItem(NONCE_KEY)
}
