/* eslint-disable no-console */
import express from 'express'
import axios from 'axios'
import winston from 'winston'
import { config } from './config'
import { decodeToken } from './auth'

const format = winston.format.combine(winston.format.timestamp(), winston.format.simple())
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({
      filename: '_error.log',
      level: 'error',
      format,
    }),
    new winston.transports.File({
      filename: '_trace.log',
      format,
    }),
  ],
})

export function endpointTracingMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const methods = ['POST', 'PUT', 'PATCH', 'DELETE']
  const endpoints = ['/cart']
  if (!config.trace || !endpoints.includes(req.originalUrl) || !methods.includes(req.method)) {
    return next()
  }
  const token = req.headers.authorization?.replace('Bearer ', '') || ''
  if (config.auth.trace) {
    console.log('Token: ', token)
  }
  const decoded = decodeToken(token)
  console.log('\x1b[34m%s\x1b[0m', '******** INBOUND TRACE ** ')
  console.table({
    method: req.method,
    endpoint: req.originalUrl,
    tokenOk: !!decoded,
    userId: decoded?.userId,
  })
  if (req.body) {
    console.table(req.body)
  }
  next()
}

export function activateAxiosTrace() {
  axios.interceptors.request.use(req => {
    // orange console log
    console.log(
      '\x1b[33m%s\x1b[0m',
      '> OUTBOUND TRACE ** ',
      req.method?.toUpperCase() || 'Request',
      req.url,
      config.trace ? req.data : '',
    )
    return req
  })

  axios.interceptors.response.use(req => {
    console.log('> Response:', req.status, req.statusText, config.trace ? req.data : '')
    return req
  })
}

export function printRouteSummary(app: express.Application) {
  logger.info('******** ROUTE SUMMARY ********')
  type Stack = {
    name: string
    handle: {
      name: string
      stack: Stack[]
    }
    regexp: string
    route: {
      path: string
      methods: {
        get?: boolean
        post?: boolean
        patch?: boolean
      }
    }
  }
  const composite = app._router.stack.find((s: Stack) => s.name === 'router') as Stack
  const recurse = (list: Stack[], level = 0): { [key: string]: string; from: string }[] => {
    let result: { [key: string]: string; from: string }[] = []
    for (const s of list) {
      if (s.route?.path) {
        result.push({
          [Object.keys(s.route.methods).join(',')]: s.route.path,
          from: level === 1 ? 'model-api' : 'controller',
        })
      } else {
        result = [...result, ...recurse(s.handle.stack, level + 1)]
      }
    }
    return result
  }
  const report = recurse([composite])
  console.log(report)
}

export default logger
