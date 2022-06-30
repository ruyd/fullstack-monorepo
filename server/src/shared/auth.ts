import { expressjwt } from 'express-jwt'
import jwt from 'jsonwebtoken'
import config from './config'

export function tokenCheck(_req, _res, next) {
  if (!config?.tokenSecret) {
    return next()
  }
  return expressjwt({
    secret: config.tokenSecret,
    algorithms: ['HS256'],
  })
}

export function createToken(obj: object) {
  return jwt.sign(obj, config.tokenSecret as string, {
    expiresIn: '2d',
  })
}
