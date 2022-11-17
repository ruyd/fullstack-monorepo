import dotenv from 'dotenv'
import { OAS3Definition } from 'swagger-jsdoc'
import packageJson from '../../package.json'
import sequelizeConfig from '../../setup/db.json'

dotenv.config({})

const env = process.env || {}

export interface Config {
  production: boolean
  port: number
  tokenSecret?: string
  jsonLimit: string
  db: {
    name: string
    url: string
    schema: string
    ssl: boolean
    force: boolean
    alter: boolean
  }
  auth?: {
    baseUrl: string
    redirectUrl: string
    clientId: string
    clientSecret: string
    ruleNamespace: string
    algorithm: 'RS256' | 'HS256'
    manageToken?: string
  }
  swaggerSetup: Partial<OAS3Definition>
}

//rework with secrets
const { database, host, username, password, ssl, schema } = sequelizeConfig.development
const DB_URL = env.DB_URL || `postgres://${username}:${password}@${host}/${database}`
const port = Number(env.PORT || 3001)
const config: Config = {
  production: env.NODE_ENV === 'production',
  port,
  tokenSecret: env.TOKEN_SECRET || 'blank',
  jsonLimit: env.JSON_LIMIT || '1mb',
  db: {
    force: false,
    alter: false,
    name: database,
    url: DB_URL,
    schema,
    ssl,
  },
  auth: {
    baseUrl: env.AUTH_BASE_URL || '',
    redirectUrl: env.AUTH_REDIRECT_URL || 'http://localhost:3000',
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

export default config
