import dotenv from 'dotenv'
import os from 'os'
import { OAS3Definition } from 'swagger-jsdoc'
import packageJson from '../../package.json'
import sequelizeConfig from '../../setup/db.json'
import logger from './logger'

const env = process.env || {}

dotenv.config({
  override: false,
})

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

const { database, host, username, password, ssl, schema } = sequelizeConfig.development
const devConnection = `postgres://${username}:${password}@${host}/${database}`
const DB_URL = env.DB_URL || env.DATABASE_URL || devConnection
const osHost = os.hostname()
const isLocalhost = osHost.includes('local')
logger.info(`⚡️env.PORT: ${env.PORT}`)
const port = Number(env.PORT || isLocalhost ? 3001 : 80)
const protocol = env.HTTPS || 'http'
const hostName = env.HOST || 'localhost'
const config: Config = {
  trace: false,
  production: env.NODE_ENV === 'production',
  isLocalhost,
  host,
  protocol,
  backendBaseUrl: `${protocol}://${hostName}:${port}`,
  certFile: env.SSL_CRT_FILE,
  certKeyFile: env.SSL_KEY_FILE,
  port,
  jsonLimit: env.JSON_LIMIT || '1mb',
  db: {
    force: false,
    alter: false,
    name: database,
    url: DB_URL,
    schema,
    ssl: env.DB_SSL === 'true' || ssl,
  },
  auth: {
    tokenSecret: env.TOKEN_SECRET || 'blank',
    tenant: env.AUTH_TENANT || 'Set AUTH_TENANT in .env',
    domain: `${env.AUTH_TENANT}.auth0.com`,
    baseUrl: `https://${env.AUTH_TENANT}.auth0.com`,
    redirectUrl: env.AUTH_REDIRECT_URL || 'http://localhost:3000/callback',
    explorerAudience: `https://${env.AUTH_TENANT}.auth0.com/api/v2/`,
    explorerId: env.AUTH_EXPLORER_ID || '',
    explorerSecret: env.AUTH_EXPLORER_SECRET || '',
    clientAudience: env.AUTH_AUDIENCE || 'https://backend',
    clientId: env.AUTH_CLIENT_ID || '',
    clientSecret: env.AUTH_CLIENT_SECRET || '',
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

export default config
