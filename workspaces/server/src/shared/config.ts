import os from 'os'
import { OAS3Definition } from 'swagger-jsdoc'
import packageJson from '../../package.json'
import appConfig from '../../config/app.json'
import logger from './logger'

export interface Config {
  isLocalhost: boolean
  trace: boolean
  production: boolean
  host: string
  port: number
  protocol: string
  backendBaseUrl: Readonly<string>
  jsonLimit: string
  certFile?: string
  certKeyFile?: string
  db: {
    name: string
    url: string
    schema: string
    ssl: boolean
    force: boolean
    alter: boolean
  }
  auth: {
    tokenSecret?: string
    tenant: string
    domain: string
    baseUrl: string
    redirectUrl: string
    explorerAudience: string
    explorerId: string
    explorerSecret: string
    ruleNamespace: string
    algorithm: 'RS256' | 'HS256'
    clientAudience: string
    clientId?: string
    clientSecret?: string
    manageToken?: string
  }
  swaggerSetup: Partial<OAS3Definition>
}

//TODO: add a secrets vault fetch then add to process.env

const { database, host, username, password, ssl, schema } = appConfig.development
const devConnection = `postgres://${username}:${password}@${host}/${database}`
const DB_URL = process.env.DB_URL || process.env.DATABASE_URL || devConnection
const osHost = os.hostname()
const isLocalhost = osHost.includes('local')
logger.info(`⚡️env.PORT: ${process.env.PORT}`)
const port = Number(process.env.PORT || isLocalhost ? 3001 : 80)
const protocol = process.env.HTTPS || 'http'
const hostName = process.env.HOST || 'localhost'
const config: Config = {
  trace: false,
  production: process.env.NODE_ENV === 'production',
  isLocalhost,
  host,
  protocol,
  backendBaseUrl: `${protocol}://${hostName}:${port}`,
  certFile: process.env.SSL_CRT_FILE,
  certKeyFile: process.env.SSL_KEY_FILE,
  port,
  jsonLimit: process.env.JSON_LIMIT || '1mb',
  db: {
    force: false,
    alter: false,
    name: database,
    url: DB_URL,
    schema,
    ssl: process.env.DB_SSL === 'true' || ssl,
  },
  auth: {
    tokenSecret: process.env.TOKEN_SECRET || 'blank',
    tenant: process.env.AUTH_TENANT || 'Set AUTH_TENANT in .env',
    domain: `${process.env.AUTH_TENANT}.auth0.com`,
    baseUrl: `https://${process.env.AUTH_TENANT}.auth0.com`,
    redirectUrl: process.env.AUTH_REDIRECT_URL || 'http://localhost:3000/callback',
    explorerAudience: `https://${process.env.AUTH_TENANT}.auth0.com/api/v2/`,
    explorerId: process.env.AUTH_EXPLORER_ID || '',
    explorerSecret: process.env.AUTH_EXPLORER_SECRET || '',
    clientAudience: process.env.AUTH_AUDIENCE || 'https://backend',
    clientId: process.env.AUTH_CLIENT_ID || '',
    clientSecret: process.env.AUTH_CLIENT_SECRET || '',
    ruleNamespace: 'https://',
    algorithm: 'RS256',
  },
  swaggerSetup: {
    openapi: '3.0.0',
    info: {
      title: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
    },
    servers: [
      {
        url: `/`,
      },
    ],
    basePath: '/docs',
  },
}

export function getClientConfig() {
  return {
    auth: {
      domain: config.auth.domain,
      baseUrl: config.auth.baseUrl,
      audience: config.auth.clientAudience,
      clientId: config.auth.clientId,
      redirectUrl: config.auth.redirectUrl,
    },
  }
}

export function getLimitedEnv() {
  return appConfig.envConcerns.reduce((acc: { [key: string]: unknown }, key: string) => {
    acc[key] = JSON.stringify(process.env[key])
    return acc
  }, {})
}

export function canStart() {
  logger.info(`⚡️Readyness Check...`)
  const portOkay = config.production ? process.env.PORT : config.port
  const dbOkay = config.production ? process.env.DB_URL || process.env.DATABASE_URL : config.db.url
  logger.info(`⚡️PORT: ${portOkay || 'ERROR - PORT not set'}`)
  logger.info(`⚡️DB: ${dbOkay || 'ERROR - DB_URL not set'}`)
  return portOkay && dbOkay
}

export default config
