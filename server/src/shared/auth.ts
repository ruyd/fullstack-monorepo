import axios from 'axios'
import express from 'express'
import { expressjwt } from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import jwt from 'jsonwebtoken'
import config from './config'

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

const jwkClient = jwksRsa({
  jwksUri: `${config.auth?.baseUrl}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
})

const jwtVerify = expressjwt({
  secret: config.tokenSecret as string,
  algorithms: ['HS256'],
})

export async function tokenCheckWare(req, _res, next) {
  if (!config?.tokenSecret) {
    return next()
  }
  const { header, token } = setRequest(req)
  if (config.auth?.algorithm === 'RS256' && header && token) {
    const result = await jwkClient.getSigningKey(header.kid)
    const key = result.getPublicKey()
    const _ = jwt.verify(token, key, { algorithms: ['RS256'] })
    return next()
  }

  return jwtVerify(req, _res, next)
}

function setRequest(req: express.Request & { auth: any }): {
  header?: jwt.JwtHeader
  token?: string
} {
  if (!req.headers.authorization?.includes('Bearer ')) {
    return {}
  }
  const token = req.headers.authorization.split(' ')[1]
  const headerChunk = token.split('.')[0]
  const decoded = Buffer.from(headerChunk, 'base64').toString()
  if (!decoded.includes('{')) {
    return {}
  }
  req.auth = decodeToken(token)
  const header = JSON.parse(decoded) as jwt.JwtHeader
  return { header, token }
}

/**
 * HS256 token encoding
 * Not for auth0 or any providers without private key
 * @param obj
 * @returns
 */
export async function createToken(obj: object) {
  const token = jwt.sign(obj, config.tokenSecret as string)
  return token
}

export function decodeToken(token: string) {
  const authInfo = jwt.decode(token) as jwt.JwtPayload
  const prefix = config.auth?.ruleNamespace || 'https://'
  const keys = Object.keys(authInfo).filter((key) => key.includes(prefix))
  for (const key of keys) {
    authInfo[key.replace(prefix, '')] = authInfo[key]
    delete authInfo[key]
  }
  return authInfo
}

export async function authProviderLogin(
  username: string,
  password: string
): Promise<oAuthResponse> {
  const response = await axios.post(
    `${config.auth?.baseUrl}/oauth/token`,
    {
      client_id: config.auth?.clientId,
      client_secret: config.auth?.clientSecret,
      audience: `${config.auth?.baseUrl}/api/v2/`,
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
): Promise<Partial<oAuthRegistered>> {
  try {
    const response = await axios.post(
      `${config.auth?.baseUrl}/dbconnections/signup`,
      {
        connection: 'Username-Password-Authentication',
        client_id: config.auth?.clientId,
        given_name: payload.firstName,
        family_name: payload.lastName,
        email: payload.email,
        password: payload.password,
        user_metadata: {
          id: payload.userId,
        },
      }
    )
    return response.data
  } catch (error: any) {
    return {
      error: error.response?.data?.name,
      error_description: error.response?.data?.description,
    }
  }
}
