import axios, { AxiosResponse } from 'axios'
import express from 'express'
import { expressjwt } from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { AppAccessToken, EnrichedRequest } from '../types'
import { Connection, EntityConfig } from '../db'
import logger from '../logger'
import { HttpUnauthorizedError } from '../errorHandler'
import { AuthProviders } from '@lib'
import { auth0Login, auth0Register } from './auth0'
import { firebaseCredentialLogin, firebaseRegister } from 'src/shared/auth/firebase'
import { getSettingsAsync } from '../settings'

export interface oAuthError {
  error?: string
  error_description?: string
  status?: number
}

export interface oAuthResponse extends oAuthError {
  access_token?: string
  id_token?: string
  scope?: string
  expires_in?: number
  token_type?: string
}

export interface oAuthRegistered extends oAuthError {
  _id?: string
  email?: string
  family_name?: string
  given_name?: string
  email_verified?: boolean
}

export interface oAuthInputs {
  email?: string
  password?: string
  idToken?: string
  firstName?: string
  lastName?: string
  uid?: string
}

export const getAuthSettingsAsync = async () => {
  const settings = await getSettingsAsync()
  const authProvider = settings?.system?.authProvider || AuthProviders.None
  const isDevelopment = authProvider === AuthProviders.Development
  const isNone = authProvider === AuthProviders.None
  const startAdminEmail = settings?.internal?.startAdminEmail
  const enableRegistration = !isNone && settings?.system?.enableRegistration
  return { settings, authProvider, isDevelopment, isNone, startAdminEmail, enableRegistration }
}

let jwkClient: jwksRsa.JwksClient
export function getJwkClient() {
  if (!jwkClient) {
    jwkClient = jwksRsa({
      jwksUri: `${config.auth?.baseUrl}/.well-known/jwks.json`,
      cache: true,
      rateLimit: true
    })
  }
  return jwkClient
}

let jwtVerify: (req: express.Request, res: express.Response, next: express.NextFunction) => void
export function getJwtVerify() {
  if (!jwtVerify) {
    jwtVerify = expressjwt({
      secret: config.auth.tokenSecret || 'off',
      algorithms: ['HS256']
    })
  }
  return jwtVerify
}

export type ModelWare = {
  config: EntityConfig
  authWare: express.Handler
}

const readMethods = ['GET', 'HEAD', 'OPTIONS']
const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

export async function checkToken(header: jwt.JwtHeader | undefined, token: string | undefined) {
  let accessToken: AppAccessToken | undefined
  const hasAuthProvider =
    config.auth.baseUrl && config.auth.clientId && config.auth.clientSecret && config.auth.enabled
  if (hasAuthProvider && header?.alg === 'RS256' && header && token) {
    const result = await getJwkClient().getSigningKey(header.kid)
    const key = result.getPublicKey()
    accessToken = jwt.verify(token, key, {
      algorithms: ['RS256']
    }) as AppAccessToken
  } else if (token) {
    accessToken = jwt.verify(token, config.auth.tokenSecret as string) as AppAccessToken
  }
  return accessToken
}

export async function tokenCheckWare(
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) {
  try {
    const { header, token } = setRequest(req)
    if (!config.auth.enabled) {
      return next()
    }
    const accessToken = await checkToken(header, token)
    if (!accessToken) {
      throw Error('Not logged in')
    }
    return next()
  } catch (err) {
    logger.error(err)
    const error = err as Error
    throw new HttpUnauthorizedError(error.message)
  }
}
export async function modelAuthMiddleware(
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) {
  try {
    const entity = Connection.entities.find(e => e.name === req.originalUrl.replace('/', ''))
    const { header, token } = setRequest(req, entity)
    if (!entity || !config.auth.enabled) {
      return next()
    }
    if (
      (entity?.publicRead && readMethods.includes(req.method)) ||
      (entity?.publicWrite && writeMethods.includes(req.method))
    ) {
      return next()
    }
    // If not public, we need a token
    const accessToken = await checkToken(header, token)
    if (entity && !accessToken) {
      throw Error('Not logged in')
    }
    // Valid, but let's heck if user has access role
    if (
      entity &&
      accessToken &&
      entity.roles?.length &&
      !entity.roles?.every(r => accessToken?.roles.includes(r))
    ) {
      throw Error('Needs user access role for request')
    }
    // All good
    return next()
  } catch (err) {
    logger.error(err)
    const error = err as Error
    throw new HttpUnauthorizedError(error.message)
  }
}

export function setRequest(
  r: express.Request,
  cfg?: EntityConfig
): {
  header?: jwt.JwtHeader
  token?: string
} {
  const req = r as EnrichedRequest
  req.config = cfg

  if (!req.headers.authorization?.includes('Bearer ')) {
    return {}
  }
  const token = req.headers.authorization.split(' ')[1]
  const headerChunk = token.split('.')[0]
  const decoded = Buffer.from(headerChunk, 'base64').toString()
  if (!decoded.includes('{')) {
    return {}
  }
  req.auth = decodeToken(token) as AppAccessToken
  const header = JSON.parse(decoded) as jwt.JwtHeader
  return { header, token }
}

/**
 * HS256 token encoding
 * Not for auth0 or any providers without private key
 * @param obj
 * @returns
 */
export function createToken(obj: object): string {
  const token = jwt.sign(obj, config.auth.tokenSecret as string)
  return token
}

export function decodeToken(token: string) {
  if (!token) {
    return undefined
  }
  const authInfo = jwt.decode(token) as jwt.JwtPayload
  if (!authInfo) {
    return undefined
  }
  const prefix = config.auth?.ruleNamespace || 'https://'
  const keys = Object.keys(authInfo).filter(key => key.includes(prefix))
  for (const key of keys) {
    authInfo[key.replace(prefix, '')] = authInfo[key]
    delete authInfo[key]
  }
  return authInfo
}

const loginMethods: Record<string, (args: oAuthInputs) => Promise<oAuthResponse>> = {
  [AuthProviders.Auth0]: auth0Login,
  [AuthProviders.Firebase]: firebaseCredentialLogin
}

export async function authProviderLogin(email: string, password: string): Promise<oAuthResponse> {
  const { authProvider } = await getAuthSettingsAsync()
  const response = await loginMethods[authProvider]({ email, password })
  return response
}

export async function fakeMockRegister(payload: oAuthInputs): Promise<oAuthRegistered> {
  const result = await new Promise(
    resolve =>
      setTimeout(() => {
        return resolve({
          data: {
            ...payload,
            provider: 'mockRegister'
          }
        })
      }, 1000) as unknown as oAuthRegistered
  )
  return result as oAuthRegistered
}

const registerMethods: Record<string, (details: oAuthInputs) => Promise<oAuthRegistered>> = {
  [AuthProviders.Auth0]: auth0Register,
  [AuthProviders.Firebase]: firebaseRegister,
  [AuthProviders.Development]: fakeMockRegister
}

export async function authProviderRegister(payload: oAuthInputs): Promise<oAuthRegistered> {
  try {
    const { authProvider } = await getAuthSettingsAsync()
    const method = registerMethods[authProvider]
    const response = await method(payload)
    return response
  } catch (err: unknown) {
    const error = err as Error & {
      response: AxiosResponse
    }
    return {
      error: error.response?.data?.name ?? error.message,
      error_description: error.response?.data?.description ?? error.message
    }
  }
}

export async function authProviderChangePassword(
  payload: Record<string, string>
): Promise<oAuthError | string> {
  try {
    const response = await axios.post(`${config.auth?.baseUrl}/dbconnections/change_password`, {
      connection: 'Username-Password-Authentication',
      client_id: config.auth?.clientId,
      email: payload.email
    })
    return response.data
  } catch (err: unknown) {
    const error = err as Error & { response: AxiosResponse }
    return {
      error: error.response?.data?.name,
      error_description: error.response?.data?.description
    }
  }
}

export async function authProviderPatch(
  sub: string,
  payload: {
    connection: string
    user_metadata: Record<string, string>
    [key: string]: unknown
  }
): Promise<oAuthError | string> {
  try {
    const token = config.auth?.manageToken
    const response = await axios.patch(
      `${config.auth?.baseUrl}/api/v2/users/${sub}`,
      {
        ...payload
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (err: unknown) {
    const error = err as Error & { response: AxiosResponse }
    return {
      error: error.response?.data?.error,
      error_description: error.response?.data?.message
    }
  }
}

export async function lazyLoadManagementToken(): Promise<boolean> {
  if (!config.auth?.explorerId) {
    return false
  }

  if (config.auth?.manageToken) {
    const decoded = jwt.decode(config.auth?.manageToken) as jwt.JwtPayload
    if (decoded.exp && decoded.exp > Date.now() / 1000) {
      return true
    } else {
      logger.info('Management token expired')
      config.auth.manageToken = undefined
    }
  }

  logger.info('Getting management token...')
  const response = await axios.post(
    `${config.auth?.baseUrl}/oauth/token`,
    {
      client_id: config.auth.explorerId,
      client_secret: config.auth.explorerSecret,
      audience: config.auth.explorerAudience,
      grant_type: 'client_credentials'
    },
    {
      validateStatus: () => true
    }
  )

  if (config.trace) {
    logger.info('response' + JSON.stringify(response.data))
  }

  if (response.data.access_token) {
    config.auth.manageToken = response.data.access_token
  }

  return true
}
