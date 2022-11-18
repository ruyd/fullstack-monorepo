import axios from 'axios'
import { lazyLoadManagementToken } from '.'
import config from '../config'
import logger from '../logger'

const readOptions = () => ({
  headers: {
    Authorization: `Bearer ${config.auth.manageToken || 'error not set'}`,
  },
  validateStatus: () => true,
})

const get = <T>(url: string) => axios.get<T>(`${config.auth?.baseUrl}/api/v2/${url}`, readOptions())
const post = <T>(url: string, data: unknown) =>
  axios.post<T>(`${config.auth?.baseUrl}/api/v2/${url}`, data, readOptions())

/**
 * Check exists and if not found, create:
 * - Check for Resource Servers
 * - Check for Clients and sets clientId and clientSecret
 * - Check for Client Grants
 * - Check for Rules
 */
export async function authProviderAutoSetup(): Promise<boolean> {
  if (!config.auth?.tenant || !config.auth?.explorerId || !config.auth?.explorerSecret) {
    logger.info('Auth0 explorer credentials not set - skipping auto-setup')
    return false
  }
  const success = await lazyLoadManagementToken()
  if (!success) {
    logger.warn('Failed to get auth0 management token - skipping auto-setup')
    return false
  }
  await ensureResourceServers()
  await ensureClients()
  await ensureRules()
  return true
}

async function ensureClients() {
  const clients = [
    {
      name: 'client',
      allowed_clients: [],
      allowed_logout_urls: [],
      callbacks: [
        'http://localhost:3000',
        'http://localhost:3000/callback',
        'http://localhost:3001',
        'https://accounts.google.com/gsi/client',
      ],
      native_social_login: {
        apple: {
          enabled: false,
        },
        facebook: {
          enabled: false,
        },
      },
      allowed_origins: ['http://localhost:3000'],
      client_aliases: [],
      token_endpoint_auth_method: 'client_secret_post',
      app_type: 'regular_web',
      grant_types: [
        'authorization_code',
        'implicit',
        'refresh_token',
        'client_credentials',
        'password',
        'http://auth0.com/oauth/grant-type/password-realm',
        'http://auth0.com/oauth/grant-type/passwordless/otp',
        'http://auth0.com/oauth/grant-type/mfa-oob',
        'http://auth0.com/oauth/grant-type/mfa-otp',
        'http://auth0.com/oauth/grant-type/mfa-recovery-code',
      ],
      web_origins: ['http://localhost:3000'],
      custom_login_page_on: true,
    },
    {
      name: 'backend',
      token_endpoint_auth_method: 'client_secret_post',
      app_type: 'non_interactive',
      grant_types: ['client_credentials'],
      custom_login_page_on: true,
    },
  ]

  interface AuthClient {
    id: string
    name: string
    is_system: boolean
    identifier: string
    scopes: string[]
    client_id: string
    client_secret: string
  }

  const existing = await get<AuthClient[]>(`clients`)
  let authClient = existing.data.find(e => e.name === 'client')
  const missing = clients.filter(rs => !existing.data.find(e => e.name === rs.name))
  if (missing.length) {
    logger.info(`Creating missing clients: ${missing.map(m => m.name).join(', ')}`)
    for (const client of missing) {
      const result = await post<AuthClient>(`clients`, client)
      if (!result.data?.id) {
        logger.error(`Failed to create client ${client.name}`)
        continue
      }
      if (client.name === 'client') {
        authClient = result.data
      }
      logger.info(`Created client ${client.name} with id ${result.data.id}`)
      const grantResult = await post<{
        id: string
        client_id: string
        audience: string
        scope: string[]
      }>(`client-grants`, {
        client_id: result.data.id,
        audience: 'https://backend',
        scope: [],
      })
      if (grantResult.data?.id) {
        logger.info(`Created client grant ${grantResult.data.id}`)
      } else {
        logger.error(`Failed to create client grant for ${client.name}`)
      }
    }
  }

  if (!config.auth.clientId && authClient) {
    logger.info(`Setting auth.clientId to ${authClient.client_id}`)
    config.auth.clientId = authClient.client_id
    config.auth.clientSecret = authClient.client_secret
  }
}

async function ensureResourceServers() {
  const resourceServers = [
    {
      name: 'backend',
      identifier: 'https://backend',
    },
  ]

  interface ResourceServer {
    id: string
    name: string
    is_system: boolean
    identifier: string
    scopes: string[]
  }

  const existing = await get<ResourceServer[]>(`resource-servers`)
  const missing = resourceServers.filter(
    rs => !existing.data.find(e => e.name === rs.name || e.identifier === rs.identifier),
  )
  if (missing.length) {
    logger.info(`Creating missing resource servers: ${missing.map(m => m.name).join(', ')}`)
    for (const rs of missing) {
      const result = await post<ResourceServer>(`resource-servers`, rs)
      logger.info(`Created resource server ${rs.name} with id ${result.data.id}`)
    }
  }
}

async function ensureRules() {
  const rules = [
    {
      name: 'enrichToken',
      script:
        'function enrichToken(user, context, callback) {\n' +
        '  let accessTokenClaims = context.accessToken || {};\n' +
        '  const assignedRoles = (context.authorization || {}).roles;\n' +
        '  accessTokenClaims[`https://roles`] = assignedRoles;\n' +
        '  user.user_metadata = user.user_metadata || {};\n' +
        '  accessTokenClaims[`https://userId`] = user.user_metadata.id;\n' +
        '  accessTokenClaims[`https://verified`] = user.email_verified;\n' +
        '  context.accessToken = accessTokenClaims;\n' +
        '  return callback(null, user, context);\n' +
        '}',
      order: 1,
      enabled: true,
    },
  ]

  interface Rule {
    id: string
    name: string
    script: string
    order: number
    enabled: boolean
    stage: string
  }

  const existing = await get<Rule[]>(`rules`)
  const missing = rules.filter(rule => !existing.data.find(erule => erule.name === rule.name))
  if (missing.length) {
    logger.info('Missing rules, creating... ' + JSON.stringify(missing))
    for (const rule of missing) {
      const result = await post<Rule>(`rules`, rule)
      logger.info('Result: ' + JSON.stringify(result.data))
    }
  }
}
