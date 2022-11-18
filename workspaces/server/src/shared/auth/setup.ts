import axios from 'axios'
import { lazyLoadManagementToken } from '.'
import config from '../config'
import logger from '../logger'

const options = {
  headers: {
    Authorization: `Bearer ${config.auth?.manageToken}`,
  },
}
const get = <T>(url: string) => axios.get<T>(`${config.auth?.baseUrl}${url}`, options)
// check client registered
// check api registered
// check m2m app created
// check rule created
export async function authProviderAutoSetup(): Promise<boolean> {
  if (!config.auth?.explorerId || !config.auth?.explorerSecret) {
    logger.info('Auth0 explorer credentials not set - skipping auth0 auto-setup')
    return false
  }
  await lazyLoadManagementToken()
  ensureRules()
  return true
}

export async function ensureClients() {
  const resourceServers = [
    {
      tenant: 'ruy',
      global: false,
      is_token_endpoint_ip_header_trusted: false,
      name: 'client',
      is_first_party: true,
      oidc_conformant: true,
      sso_disabled: false,
      cross_origin_auth: false,
      refresh_token: {
        expiration_type: 'non-expiring',
        leeway: 0,
        infinite_token_lifetime: true,
        infinite_idle_token_lifetime: true,
        token_lifetime: 31557600,
        idle_token_lifetime: 2592000,
        rotation_type: 'non-rotating',
      },
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
      tenant: config.auth?.tenant,
      global: false,
      is_token_endpoint_ip_header_trusted: false,
      name: 'backend (Test Application)',
      is_first_party: true,
      oidc_conformant: true,
      sso_disabled: false,
      cross_origin_auth: false,
      refresh_token: {
        expiration_type: 'non-expiring',
        leeway: 0,
        infinite_token_lifetime: true,
        infinite_idle_token_lifetime: true,
        token_lifetime: 31557600,
        idle_token_lifetime: 2592000,
        rotation_type: 'non-rotating',
      },
      callback_url_template: false,
      token_endpoint_auth_method: 'client_secret_post',
      app_type: 'non_interactive',
      grant_types: ['client_credentials'],
      custom_login_page_on: true,
    },
  ]

  interface ResourceServer {
    id: string
    name: string
    is_system: boolean
    identifier: string
    scopes: string[]
  }

  const existing = await get<ResourceServer[]>(`/api/v2/resource-servers`)
  const missing = resourceServers.filter(rs => !existing.data.find(e => e.name === rs.name))
  if (missing.length) {
    logger.info(`Creating missing resource servers: ${missing.map(m => m.name).join(', ')}`)
    for (const rs of missing) {
      const result = await axios.post(
        `${config.auth?.baseUrl}/api/v2/resource-servers`,
        rs,
        options,
      )
      logger.info(`Created resource server ${rs.name} with id ${result.data.id}`)
    }
  }
}

export async function ensureAudiences() {
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

  const existing = await get<ResourceServer[]>(`/api/v2/resource-servers`)
  const missing = resourceServers.filter(rs => !existing.data.find(e => e.name === rs.name))
  if (missing.length) {
    logger.info(`Creating missing resource servers: ${missing.map(m => m.name).join(', ')}`)
    for (const rs of missing) {
      const result = await axios.post(
        `${config.auth?.baseUrl}/api/v2/resource-servers`,
        rs,
        options,
      )
      logger.info(`Created resource server ${rs.name} with id ${result.data.id}`)
    }
  }
}

export async function ensureRules() {
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

  const existing = await axios.get<Rule[]>(`${config.auth?.baseUrl}/api/v2/rules`, {
    headers: {
      Authorization: `Bearer ${config.auth?.manageToken}`,
    },
  })
  const missing = rules.filter(rule => !existing.data.find(erule => erule.name === rule.name))
  if (missing.length) {
    logger.info('Missing rules, creating... ' + JSON.stringify(missing))
    for (const rule of missing) {
      const result = await axios.post(`${config.auth?.baseUrl}/api/v2/rules`, rule, {
        headers: {
          Authorization: `Bearer ${config.auth.manageToken}`,
        },
        validateStatus: () => true,
      })
      logger.info('Result: ' + JSON.stringify(result.data))
    }
  }
}

export const clientGrant = {
  id: 'cgr_pfipbMCYcfGthu9T',
  client_id: 'xxoZLRwiqzfVGwz5u1QrpXymMWOjfidv',
  audience: 'https://backend',
  scope: [],
}
