import axios from 'axios'
import { expressjwt, GetVerificationKey } from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import jwt from 'jsonwebtoken'
import config from './config'
import fs from 'fs'
import path from 'path'

export interface oAuthResponse {
  access_token: string
  id_token: string
  scope: string
  expires_in: number
  token_type: string
  error?: string
  error_description?: string
}

export interface oAuthRegistered {
  _id: string
  email: string
  family_name: string
  given_name: string
  email_verified: boolean
  error?: string
  error_description?: string
}

const getKeysMiddleware = jwksRsa.expressJwtSecret({
  jwksUri: `${config.authProvider?.baseUrl}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
}) as GetVerificationKey

const jwkVerify = expressjwt({
  secret: getKeysMiddleware,
  algorithms: ['RS256'],
})

const jwtVerify = expressjwt({
  secret: config.tokenSecret as string,
  algorithms: ['HS256'],
})

export function tokenCheck(_req, _res, next) {
  if (!config?.tokenSecret) {
    return next()
  }
  let handler = jwtVerify
  if (_req.headers.authorization?.includes('Bearer ')) {
    const token = _req.headers.authorization?.split(' ')[1]
    const headerChunk = token.split('.')[0]
    const decoded = Buffer.from(headerChunk, 'base64').toString()
    const header = decoded.includes('{')
      ? (JSON.parse(decoded) as jwt.JwtHeader)
      : null
    if (header?.alg === 'RS256') {
      handler = jwkVerify
    }
  }
  return handler(_req, _res, next)
}

/**
 * Local token encoding
 * Not for auth0 or any providers without private key
 * @param obj
 * @returns
 */
export async function createToken(obj: object) {
  const token = jwt.sign(obj, config.tokenSecret as string)
  return token
}

export function decodeToken<T extends jwt.JwtPayload>(token: string): T {
  const authInfo = jwt.decode(token) as T
  return authInfo
}

export async function authProviderLogin(
  username: string,
  password: string
): Promise<oAuthResponse> {
  const response = await axios.post(
    `${config.authProvider?.baseUrl}/oauth/token`,
    {
      client_id: config.authProvider?.clientId,
      client_secret: config.authProvider?.clientSecret,
      audience: `${config.authProvider?.baseUrl}/api/v2/`,
      grant_type: 'password',
      username,
      password,
    },
    {
      validateStatus: () => true,
    }
  )
  return response.data
}

export async function authProviderRegister(
  payload: Record<string, string>
): Promise<oAuthRegistered> {
  const response = await axios.post(
    `${config.authProvider?.baseUrl}/dbconnections/signup`,
    {
      connection: 'Username-Password-Authentication',
      client_id: config.authProvider?.clientId,
      given_name: payload.firstName,
      family_name: payload.lastName,
      email: payload.email,
      password: payload.password,
      user_metadata: {
        userId: payload.userId,
      },
    }
  )
  return response.data
}

//https://ruy.auth0.com/authorize?client_id=nGKyd_1WxWhol-4bBxTphcwmzeVXz89f&response_type=code&connection=google-oauth2&prompt=login&scope=openid%20profile&redirect_uri=https://manage.auth0.com/tester/callback?connection=google-oauth2
