import { expressjwt as jwt } from 'express-jwt'
import config from './config'

export const tokenCheck = (_req, _res, next) => {
  if (!config?.tokenSecret) {
    return next()
  }
  return jwt({
    secret: config.tokenSecret,
    algorithms: ['HS256'],
  })
}
